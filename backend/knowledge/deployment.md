# Deployment - Complete Guide for DevSync

## Table of Contents
1. [Deployment Fundamentals](#fundamentals)
2. [Deployment Strategies](#strategies)
3. [Pre-Deployment Checklist](#checklist)
4. [Deployment Process](#process)
5. [Post-Deployment](#post)
6. [Rollback Procedures](#rollback)
7. [Database Migrations](#migrations)
8. [Monitoring Deployment](#monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Deployment Automation](#automation)

## Deployment Fundamentals {#fundamentals}

Deployment is the process of releasing software from development to production environment.

### Deployment Goals
- ✅ Minimize downtime
- ✅ Ensure reliability
- ✅ Enable quick rollback
- ✅ Maintain data integrity
- ✅ Zero-knowledge deployment

### Environments
- **Development**: Local machine
- **Staging**: Production-like environment
- **Production**: Live environment for users

## Deployment Strategies {#strategies}

### 1. Blue-Green Deployment
Two identical production environments, switch traffic between them.

```yaml
# Blue environment (current)
version: 1.0.0
replicas: 3

# Green environment (new)
version: 2.0.0
replicas: 3

# Once verified, switch:
- Update load balancer to point to green
- Monitor for issues
- Keep blue as rollback
```

**Advantages**: Zero downtime, easy rollback
**Disadvantages**: Requires 2x resources

### 2. Canary Deployment
Gradually roll out to a subset of users.

```yaml
# Stage 1: Deploy to 10% of servers
kubectl set image deployment/app app=v2.0 --record
kubectl rollout status deployment/app

# Stage 2: Route 10% of traffic
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app
spec:
  hosts:
  - app
  http:
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: app
        subset: v1
      weight: 90
    - destination:
        host: app
        subset: v2
      weight: 10

# Stage 3: Increase gradually to 100%
```

**Advantages**: Low risk, quick detection of issues
**Disadvantages**: Complex monitoring required

### 3. Rolling Deployment
Gradually replace old pods with new ones.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1      # Add 1 new pod at a time
      maxUnavailable: 0  # Don't kill pods until ready
  template:
    spec:
      containers:
      - name: app
        image: app:v2.0
        readinessProbe:  # Important!
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
```

**Advantages**: Simple, built-in to K8s
**Disadvantages**: Multiple versions running simultaneously

### 4. Feature Flags
Deploy code but control feature visibility.

```javascript
// Feature flag service
function isFeatureEnabled(featureName, userId) {
  const featureConfig = {
    'new-dashboard': { enabled: true, rolloutPercentage: 50 },
    'dark-mode': { enabled: false }
  };
  
  const feature = featureConfig[featureName];
  if (!feature || !feature.enabled) return false;
  
  const hash = hashUserId(userId);
  return hash % 100 < feature.rolloutPercentage;
}

// Usage
if (isFeatureEnabled('new-dashboard', userId)) {
  return renderNewDashboard();
} else {
  return renderOldDashboard();
}
```

## Pre-Deployment Checklist {#checklist}

### Code Quality
- [ ] All tests passing
- [ ] Code review completed
- [ ] No security vulnerabilities
- [ ] Performance tested
- [ ] Documentation updated

### Configuration
- [ ] Environment variables configured
- [ ] Database connection strings correct
- [ ] API endpoints correct
- [ ] Feature flags configured
- [ ] Secrets securely stored

### Infrastructure
- [ ] Database migrations prepared
- [ ] Backup created
- [ ] Scaling configured
- [ ] Health checks configured
- [ ] Monitoring/alerting ready

### Communication
- [ ] Stakeholders notified
- [ ] Support team briefed
- [ ] Rollback plan documented
- [ ] Status page updated
- [ ] On-call person assigned

## Deployment Process {#process}

### Standard Deployment Flow

```bash
#!/bin/bash
set -e

# 1. Verify preconditions
echo "Checking prerequisites..."
if [ -z "$VERSION" ]; then
  echo "Error: VERSION not set"
  exit 1
fi

# 2. Build and test
echo "Building application..."
npm run build
npm test

# 3. Create backup
echo "Creating backup..."
aws s3 sync s3://prod-backup/ s3://prod-backup-pre-deploy-${VERSION}/

# 4. Create Docker image
echo "Building Docker image..."
docker build -t app:${VERSION} .
docker tag app:${VERSION} registry.example.com/app:${VERSION}

# 5. Push to registry
echo "Pushing to registry..."
docker push registry.example.com/app:${VERSION}

# 6. Run migrations
echo "Running database migrations..."
kubectl run migration-${VERSION} \
  --image=registry.example.com/app:${VERSION} \
  --restart=Never \
  -- npm run migrate
kubectl wait --for=condition=ready pod/migration-${VERSION} --timeout=300s

# 7. Deploy to staging
echo "Deploying to staging..."
kubectl set image deployment/app-staging \
  app=registry.example.com/app:${VERSION} \
  -n staging

# 8. Run smoke tests
echo "Running smoke tests..."
npm run smoke-tests -- --url=https://staging.example.com

# 9. Deploy to production (canary)
echo "Deploying to production (canary: 10%)..."
kubectl set image deployment/app \
  app=registry.example.com/app:${VERSION} \
  -n production
kubectl rollout pause deployment/app -n production

# 10. Monitor
echo "Monitoring deployment..."
sleep 300  # Monitor for 5 minutes
ERROR_RATE=$(kubectl exec deployment/app -n production -- \
  curl localhost:8000/metrics | grep error_rate)

if [ $ERROR_RATE > 0.01 ]; then
  echo "Error rate too high, rolling back..."
  kubectl rollout undo deployment/app -n production
  exit 1
fi

# 11. Complete deployment
echo "Completing deployment..."
kubectl rollout resume deployment/app -n production
kubectl rollout status deployment/app -n production

# 12. Verify
echo "Verifying deployment..."
curl https://api.example.com/health

echo "✅ Deployment completed successfully!"
```

## Post-Deployment {#post}

### Verification Steps

```bash
# 1. Health checks
curl https://api.example.com/health
# Expected: { "status": "ok", "version": "2.0.0" }

# 2. Performance monitoring
kubectl top pods -n production

# 3. Error rate
kubectl logs deployment/app -n production | grep ERROR | wc -l

# 4. Database queries
SELECT COUNT(*) as request_count FROM logs WHERE status >= 500;

# 5. User feedback
# Check customer support channels, social media

# 6. Business metrics
# Check: conversions, sign-ups, active users
```

### Success Criteria

- [ ] No increase in error rates (< 0.1%)
- [ ] Response time acceptable (< 200ms p95)
- [ ] CPU/Memory usage normal
- [ ] No customer complaints
- [ ] Database connection pool healthy

## Rollback Procedures {#rollback}

### Immediate Rollback (< 5 minutes)

```bash
#!/bin/bash

echo "🚨 Rolling back deployment..."

# Kubernetes rollback
kubectl rollout undo deployment/app -n production
kubectl rollout status deployment/app -n production

# Database rollback (if needed)
# mysql -h prod-db.example.com < backup/latest.sql

# Clear caches
redis-cli FLUSHALL

# Verify rollback
curl https://api.example.com/health

echo "✅ Rollback completed"
```

### Complete Rollback Plan

1. **Immediate Actions (1-5 min)**
   - Execute rollback command
   - Verify old version running
   - Update status page

2. **Communication (5 min)**
   - Notify team
   - Update status page
   - Prepare statement for users

3. **Investigation (During/After)**
   - Collect logs from failed deployment
   - Analyze metrics
   - Identify root cause

4. **Prevention**
   - Fix the issue
   - Add test case
   - Update procedures

## Database Migrations {#migrations}

### Safe Migration Pattern

```javascript
// 1. Backward compatible addition
// Version 1: Add new column (nullable)
migration.up = async () => {
  await db.schema.table('users', table => {
    table.string('phone').nullable();
  });
};

migration.down = async () => {
  await db.schema.table('users', table => {
    table.dropColumn('phone');
  });
};

// 2. Deploy code that reads both old and new
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
const phone = user.phone || user.phone_number; // Support both

// 3. Migrate data
migration.up = async () => {
  await db.raw('UPDATE users SET phone = phone_number');
};

// 4. Deploy code that only writes to new column
const user = new User({ phone: '555-1234' });
await user.save(); // Only writes to 'phone'

// 5. Remove old column
migration.up = async () => {
  await db.schema.table('users', table => {
    table.dropColumn('phone_number');
  });
};
```

### Zero-Downtime Migration

```bash
# 1. Create new table alongside existing
CREATE TABLE users_v2 AS SELECT * FROM users;

# 2. Create triggers to keep in sync
CREATE TRIGGER users_sync AFTER INSERT ON users
  BEGIN INSERT INTO users_v2 VALUES(...); END;

# 3. Copy any missing data
INSERT INTO users_v2 SELECT * FROM users WHERE id NOT IN (SELECT id FROM users_v2);

# 4. Verify data consistency
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users_v2;

# 5. Atomically swap
RENAME TABLE users TO users_old, users_v2 TO users;

# 6. Update constraints, indexes, etc.
ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY (id);

# 7. Keep old table for rollback
-- Keep users_old as backup for 24 hours
```

## Monitoring Deployment {#monitoring}

### Key Metrics to Watch

```yaml
Metrics:
  Application:
    - Error rate (target: < 0.1%)
    - Response time (target: < 200ms p95)
    - Requests per second
    - Database connection pool usage
    - Cache hit rate

  Infrastructure:
    - CPU utilization (target: < 70%)
    - Memory usage (target: < 80%)
    - Disk I/O
    - Network latency
    - Pod restarts

  Business:
    - User sign-ups
    - Conversion rate
    - Active users
    - Revenue
    - Customer support tickets

Alert Thresholds:
  Critical:
    - Error rate > 1%
    - Response time > 500ms
    - Pod restarts > 3 in 5 min
    - CPU > 90%
    
  Warning:
    - Error rate > 0.5%
    - Response time > 300ms
    - CPU > 70%
```

## Troubleshooting {#troubleshooting}

### Common Issues

**Pod not starting**
```bash
# Check pod status
kubectl describe pod app-xyz -n production

# Check logs
kubectl logs app-xyz -n production

# Check resource requests
kubectl top pod app-xyz -n production

# Common causes:
# - Image not found: Check registry, image name, tag
# - Insufficient resources: Check node capacity, resource requests
# - Readiness probe failing: Check application startup logs
```

**High error rate**
```bash
# Check application logs
kubectl logs -l app=app -n production --tail=100

# Check database connectivity
kubectl exec deployment/app -n production -- \
  npm run test:db

# Check dependencies
curl https://api.dependency.com/health

# Rollback if necessary
kubectl rollout undo deployment/app -n production
```

**Slow response times**
```bash
# Check resource usage
kubectl top nodes
kubectl top pods

# Check database queries
EXPLAIN SELECT ... FROM large_table;

# Check cache status
redis-cli INFO stats

# Check network latency
kubectl exec pod/app -- ping external-service
```

## Deployment Automation {#automation}

### CI/CD Pipeline Integration

```yaml
# GitLab CI Example
deploy_production:
  stage: deploy
  image: kubectl:latest
  script:
    # Build and push image
    - docker build -t registry/app:$CI_COMMIT_SHA .
    - docker push registry/app:$CI_COMMIT_SHA
    
    # Run migrations
    - kubectl run migration-$CI_COMMIT_SHA \
        --image=registry/app:$CI_COMMIT_SHA \
        --restart=Never \
        -- npm run migrate
    - kubectl wait --for=condition=ready pod/migration-$CI_COMMIT_SHA
    
    # Deploy with canary
    - kubectl set image deployment/app \
        app=registry/app:$CI_COMMIT_SHA
    - kubectl rollout pause deployment/app
    
    # Wait and monitor
    - sleep 300
    - ./scripts/verify-deployment.sh
    
    # Complete rollout
    - kubectl rollout resume deployment/app
    - kubectl rollout status deployment/app
    
  environment:
    name: production
    url: https://api.example.com
  when: manual
  only:
    - main
```

---

**Learn More**: https://devops.com