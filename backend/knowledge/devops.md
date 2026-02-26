# DevOps - Complete Guide for DevSync

## Table of Contents
1. [DevOps Fundamentals](#fundamentals)
2. [CI/CD Pipelines](#cicd)
3. [Infrastructure as Code](#iac)
4. [Monitoring & Logging](#monitoring)
5. [Container Orchestration](#orchestration)
6. [Git Workflows](#git)
7. [Testing & Quality](#testing)
8. [Security & Compliance](#security)
9. [Incident Management](#incidents)
10. [Best Practices](#practices)

## DevOps Fundamentals {#fundamentals}

DevOps combines Development and Operations to shorten the systems development lifecycle while delivering features, fixes, and updates frequently in close alignment with business objectives.

### Core Principles
- **Automation**: Automate repetitive tasks
- **Collaboration**: Break silos between teams
- **Measurement**: Monitor and measure everything
- **Sharing**: Share knowledge and responsibilities
- **Continuous Improvement**: Always iterate

### DevOps Lifecycle
```
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor → Feedback
```

## CI/CD Pipelines {#cicd}

### GitHub Actions

**.github/workflows/ci.yml**
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t ${{ secrets.REGISTRY }}/${{ secrets.IMAGE }}:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
          docker push ${{ secrets.REGISTRY }}/${{ secrets.IMAGE }}:${{ github.sha }}
      
      - name: Deploy to staging
        run: |
          kubectl set image deployment/app app=${{ secrets.REGISTRY }}/${{ secrets.IMAGE }}:${{ github.sha }} -n staging
          kubectl rollout status deployment/app -n staging
```

### GitLab CI

**.gitlab-ci.yml**
```yaml
stages:
  - build
  - test
  - deploy

variables:
  REGISTRY: registry.gitlab.com
  IMAGE_NAME: $REGISTRY/$CI_PROJECT_NAMESPACE/$CI_PROJECT_NAME

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $IMAGE_NAME:$CI_COMMIT_SHA .
    - docker push $IMAGE_NAME:$CI_COMMIT_SHA
  only:
    - main

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/Coverage: \d+\.\d+/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

deploy_staging:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/app app=$IMAGE_NAME:$CI_COMMIT_SHA -n staging
    - kubectl rollout status deployment/app -n staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/app app=$IMAGE_NAME:$CI_COMMIT_SHA -n production
    - kubectl rollout status deployment/app -n production
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

## Infrastructure as Code {#iac}

### Terraform

**main.tf**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "devsync-vpc"
    Environment = var.environment
  }
}

# Subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}

# RDS
resource "aws_db_instance" "main" {
  identifier       = "devsync-db"
  engine           = "postgres"
  engine_version   = "15"
  instance_class   = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "devsync"
  username = "admin"
  password = random_password.db_password.result
  
  multi_az              = true
  publicly_accessible   = false
  skip_final_snapshot   = false
  final_snapshot_identifier = "devsync-final-snapshot"
  
  tags = {
    Name = "devsync-db"
  }
}

# Output
output "db_endpoint" {
  value       = aws_db_instance.main.endpoint
  description = "Database endpoint"
}
```

## Monitoring & Logging {#monitoring}

### Prometheus & Grafana

**prometheus.yml**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'app'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['localhost:8000']
```

**alerts.yml**
```yaml
groups:
  - name: app_alerts
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: node_cpu_usage > 80
        for: 5m
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is {{ $value }}%"

      - alert: HighMemoryUsage
        expr: node_memory_usage > 85
        for: 5m
        annotations:
          summary: "High memory usage"

      - alert: ServiceDown
        expr: up{job="app"} == 0
        for: 1m
        annotations:
          summary: "{{ $labels.job }} is down"
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

**logstash.conf**
```
input {
  file {
    path => "/var/log/app/*.log"
    start_position => "beginning"
    codec => multiline {
      pattern => "^%{TIMESTAMP_ISO8601}"
      negate => true
      what => "previous"
    }
  }
}

filter {
  grok {
    match => {
      "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{DATA:logger} %{GREEDYDATA:message}"
    }
  }
  
  mutate {
    convert => { "level" => "string" }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
  stdout { codec => rubydebug }
}
```

## Container Orchestration {#orchestration}

### Docker Compose for Local Development

**docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/devsync
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - devsync

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=devsync
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - devsync

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - redis_data:/data
    networks:
      - devsync

volumes:
  db_data:
  redis_data:

networks:
  devsync:
    driver: bridge
```

## Git Workflows {#git}

### Git Flow

```bash
# Start feature
git checkout -b feature/user-authentication develop

# Commit changes
git commit -m "feat: add user authentication"

# Create pull request
git push origin feature/user-authentication

# After review, merge to develop
git checkout develop
git merge --no-ff feature/user-authentication
git push origin develop

# Release
git checkout -b release/1.0.0 develop
# Update version numbers
git commit -m "chore: bump version to 1.0.0"

# Merge to main and develop
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

git checkout develop
git merge --no-ff release/1.0.0

# Hotfix
git checkout -b hotfix/1.0.1 main
# Fix bug
git commit -m "fix: critical bug fix"
git checkout main
git merge --no-ff hotfix/1.0.1
git tag v1.0.1
```

## Testing & Quality {#testing}

### Test Strategy

```javascript
// Unit tests (Jest)
describe('User Service', () => {
  it('should create a user', async () => {
    const user = await userService.create({
      name: 'John',
      email: 'john@example.com'
    });
    expect(user.id).toBeDefined();
  });
});

// Integration tests
describe('User API', () => {
  it('GET /api/users should return users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

// E2E tests (Cypress/Playwright)
describe('User Registration', () => {
  it('should register new user', () => {
    cy.visit('/signup');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('SecurePassword123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Security & Compliance {#security}

### Security Checklist

```yaml
Security Measures:
  Authentication:
    - Implement JWT tokens
    - Use strong password requirements
    - Enable MFA/2FA
    - Implement session timeout

  Authorization:
    - Use role-based access control (RBAC)
    - Principle of least privilege
    - Regular access reviews
    - Audit logging

  Data Security:
    - Encrypt data in transit (TLS/SSL)
    - Encrypt data at rest
    - Use secure key management
    - Regular backups with encryption

  Infrastructure:
    - Use secrets manager
    - Network segmentation
    - Web Application Firewall (WAF)
    - DDoS protection
    - Regular security audits
    - Vulnerability scanning

  Compliance:
    - GDPR compliance (if EU users)
    - Data retention policies
    - Privacy policy
    - Terms of service
    - Regular security training
```

## Incident Management {#incidents}

### Incident Response Playbook

```markdown
# Incident Response

## Detection
- Monitor alerts
- Customer reports
- Automated monitoring

## Assessment
- Severity level (Critical, High, Medium, Low)
- Impact (users affected, services down)
- Root cause investigation

## Resolution Steps
1. Activate incident response team
2. Establish communication channel
3. Implement temporary fix (if needed)
4. Work on permanent solution
5. Deploy fix
6. Verify resolution
7. Close ticket

## Post-Incident
- Conduct blameless post-mortem
- Document root cause
- Create action items
- Update runbooks
- Share learnings
```

## Best Practices {#practices}

### DevOps Best Practices

1. **Infrastructure as Code**
   - Version control all infrastructure
   - Test infrastructure changes
   - Document infrastructure

2. **Continuous Integration**
   - Automated tests on every commit
   - Fast feedback (< 10 minutes)
   - Automatic deployments

3. **Monitoring & Observability**
   - Monitor all critical services
   - Log aggregation
   - Distributed tracing
   - Alerting on business metrics

4. **Runbooks & Documentation**
   - How to deploy
   - How to rollback
   - Troubleshooting guides
   - Post-mortems

5. **Automation**
   - Automate repetitive tasks
   - Infrastructure provisioning
   - Testing
   - Deployments

---

**Learn More**: https://www.atlassian.com/devops