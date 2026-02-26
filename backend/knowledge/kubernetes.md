# Kubernetes - Complete Guide for DevSync

## Table of Contents
1. [Kubernetes Fundamentals](#fundamentals)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation)
4. [Core Objects](#objects)
5. [Deployments & Scaling](#deployments)
6. [Services & Networking](#services)
7. [Storage](#storage)
8. [ConfigMaps & Secrets](#config)
9. [Ingress](#ingress)
10. [Best Practices](#practices)
11. [Troubleshooting](#troubleshooting)

## Kubernetes Fundamentals {#fundamentals}

Kubernetes (K8s) is an open-source container orchestration platform that automates containerized application deployment, scaling, and management.

### Why Kubernetes?
- **Automated deployment**: Deploy containers across clusters
- **Self-healing**: Restart failed containers
- **Load balancing**: Distribute traffic intelligently
- **Scaling**: Auto-scale based on demand
- **Rolling updates**: Zero-downtime deployments
- **Resource management**: Optimal use of infrastructure
- **Multi-cloud**: Deploy anywhere (AWS, Azure, GCP, on-premise)

### Core Concepts

**Cluster**
- Master Node: Controls the cluster (API Server, Scheduler, Controller Manager)
- Worker Nodes: Run containerized applications
- Each node has kubelet, container runtime (Docker), kube-proxy

**Pod**
- Smallest deployable unit
- Can contain one or more containers (usually one)
- Containers in pod share network namespace

**Namespace**
- Virtual cluster within a cluster
- Default namespaces: default, kube-system, kube-public

**Labels & Selectors**
- Key-value pairs for organizing resources
- Selectors used to find and manage resources

## Architecture {#architecture}

### Kubernetes Cluster Architecture
```
                        ┌──────────────────────┐
                        │   Master Node        │
                        ├──────────────────────┤
                        │ API Server           │
                        │ Scheduler            │
                        │ Controller Manager   │
                        │ etcd (Data Store)    │
                        └──────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
            ┌───────▼────┐ ┌──────▼────┐ ┌─────▼─────┐
            │ Worker 1   │ │ Worker 2  │ │ Worker 3  │
            ├────────────┤ ├───────────┤ ├───────────┤
            │ Kubelet    │ │ Kubelet   │ │ Kubelet   │
            │ Docker     │ │ Docker    │ │ Docker    │
            │ kube-proxy │ │ kube-proxy│ │ kube-proxy│
            │ Pod 1, 2   │ │ Pod 3, 4  │ │ Pod 5, 6  │
            └────────────┘ └───────────┘ └───────────┘
```

### Kubernetes Objects
- **Pod**: Smallest unit containing containers
- **Deployment**: Manages replicas of pods
- **Service**: Exposes pods to network
- **ConfigMap**: Store configuration data
- **Secret**: Store sensitive data
- **PersistentVolume**: Storage resource
- **Ingress**: HTTP/HTTPS routing
- **StatefulSet**: Manages stateful applications
- **DaemonSet**: Runs pod on each node
- **Job**: Runs containers to completion

## Installation & Setup {#installation}

### Install kubectl

**macOS**
```bash
# Using Homebrew
brew install kubectl

# Or download directly
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
```

**Linux**
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
```

### Local Kubernetes Cluster

**minikube (Single-node cluster)**
```bash
# Install minikube
brew install minikube

# Start cluster
minikube start --cpus=4 --memory=8192

# Stop cluster
minikube stop

# Delete cluster
minikube delete

# Access dashboard
minikube dashboard
```

**Docker Desktop**
- Enable Kubernetes in Docker Desktop settings
- Automatically creates local cluster

### Connect to Cluster

**Configure kubeconfig**
```bash
# View kubeconfig
kubectl config view

# Get context
kubectl config current-context

# Switch context
kubectl config use-context my-cluster

# Set default namespace
kubectl config set-context --current --namespace=production
```

## Core Objects {#objects}

### Pod

**Pod YAML**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  namespace: default
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: myapp:1.0
    ports:
    - containerPort: 8000
    env:
    - name: NODE_ENV
      value: "production"
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 500m
        memory: 512Mi
    livenessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 5
```

**Pod Commands**
```bash
# Create pod
kubectl apply -f pod.yaml

# Get pods
kubectl get pods
kubectl get pods -o wide
kubectl get pods --all-namespaces

# Describe pod
kubectl describe pod myapp-pod

# Logs
kubectl logs myapp-pod
kubectl logs -f myapp-pod  # Follow logs

# Execute command in pod
kubectl exec -it myapp-pod -- /bin/bash

# Port forward to local machine
kubectl port-forward myapp-pod 8000:8000

# Delete pod
kubectl delete pod myapp-pod
```

## Deployments & Scaling {#deployments}

### Deployment

**Deployment YAML**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  namespace: default
spec:
  replicas: 3  # Number of pods
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1      # New pods during update
      maxUnavailable: 0  # Pods unavailable during update
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: 1.0
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: LOG_LEVEL
          value: "info"
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
```

**Deployment Commands**
```bash
# Create deployment
kubectl apply -f deployment.yaml

# Get deployments
kubectl get deployments
kubectl get deployments -o wide

# Describe deployment
kubectl describe deployment myapp-deployment

# Scale deployment
kubectl scale deployment myapp-deployment --replicas=5

# Update image
kubectl set image deployment/myapp-deployment \
  myapp=myapp:2.0 --record

# Rollout status
kubectl rollout status deployment/myapp-deployment

# Rollback to previous version
kubectl rollout undo deployment/myapp-deployment

# View rollout history
kubectl rollout history deployment/myapp-deployment

# Delete deployment
kubectl delete deployment myapp-deployment
```

### Horizontal Pod Autoscaler (HPA)

**HPA YAML**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

**HPA Commands**
```bash
# Create HPA
kubectl apply -f hpa.yaml

# Get HPA status
kubectl get hpa
kubectl describe hpa myapp-hpa

# Watch HPA scaling
kubectl get hpa -w
```

## Services & Networking {#services}

### Service Types

**ClusterIP (Default)**
- Internal communication only
- Not accessible from outside

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP
  selector:
    app: myapp
  ports:
  - name: http
    port: 80
    targetPort: 8000
    protocol: TCP
```

**NodePort**
- Exposes service on each node's IP
- Accessible from outside (node_ip:node_port)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8000
    nodePort: 30000  # Port on node (30000-32767)
```

**LoadBalancer**
- Creates external load balancer
- For cloud providers (AWS, Azure, GCP)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8000
```

**Service Commands**
```bash
# Create service
kubectl apply -f service.yaml

# Get services
kubectl get services
kubectl get svc -o wide

# Describe service
kubectl describe service myapp-service

# Get service details
kubectl get svc myapp-service -o yaml

# Delete service
kubectl delete service myapp-service
```

### DNS in Kubernetes
```
# Cluster DNS format: service-name.namespace.svc.cluster.local

# Access from same namespace
http://myapp-service:80

# Access from different namespace
http://myapp-service.production.svc.cluster.local:80
```

## Storage {#storage}

### PersistentVolume & PersistentVolumeClaim

**PersistentVolume (PV)**
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-data
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  hostPath:
    path: /mnt/data
```

**PersistentVolumeClaim (PVC)**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 5Gi
```

**Using PVC in Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
        volumeMounts:
        - name: data
          mountPath: /app/data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: pvc-data
```

**Storage Commands**
```bash
# Get PVs
kubectl get pv

# Get PVCs
kubectl get pvc

# Describe PVC
kubectl describe pvc pvc-data

# Delete PVC
kubectl delete pvc pvc-data
```

## ConfigMaps & Secrets {#config}

### ConfigMap

**ConfigMap YAML**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    server.port=8000
    logging.level=INFO
  database.url: mongodb://mongo:27017/mydb
  cache.ttl: "3600"
```

**Use ConfigMap in Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
        env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database.url
        - name: CACHE_TTL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: cache.ttl
        volumeMounts:
        - name: config
          mountPath: /etc/config
      volumes:
      - name: config
        configMap:
          name: app-config
```

**ConfigMap Commands**
```bash
# Create from literal
kubectl create configmap app-config --from-literal=key=value

# Create from file
kubectl create configmap app-config --from-file=config.yaml

# Get ConfigMap
kubectl get configmap
kubectl describe configmap app-config
kubectl get configmap app-config -o yaml

# Edit ConfigMap
kubectl edit configmap app-config
```

### Secret

**Secret YAML**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  # base64 encoded values
  database-password: cGFzc3dvcmQxMjMh  # password123!
  api-key: c2VjcmV0LWtleS0xMjM=       # secret-key-123
stringData:
  # plaintext (auto-encoded)
  jwt-secret: my-jwt-secret-key
```

**Use Secret in Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
        env:
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-password
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-key
```

**Secret Commands**
```bash
# Create secret from literal
kubectl create secret generic app-secrets \
  --from-literal=password=mypassword \
  --from-literal=api-key=mykey

# Create from file
kubectl create secret generic app-secrets --from-file=secrets.txt

# Get secrets
kubectl get secrets
kubectl describe secret app-secrets

# Decode secret value
kubectl get secret app-secrets -o jsonpath='{.data.password}' | base64 -d
```

## Ingress {#ingress}

### Ingress Configuration

**Ingress YAML**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: myapp-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
  - host: admin.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: admin-service
            port:
              number: 80
```

**Ingress Commands**
```bash
# Create ingress
kubectl apply -f ingress.yaml

# Get ingress
kubectl get ingress
kubectl describe ingress myapp-ingress

# Get ingress IP
kubectl get ingress -o wide

# Delete ingress
kubectl delete ingress myapp-ingress
```

## Best Practices {#practices}

### Resource Management
```yaml
# Always set resource requests and limits
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

### Health Checks
```yaml
# Liveness Probe (restart if failed)
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 10

# Readiness Probe (remove from load balancer if failed)
readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Security
```yaml
# Run as non-root user
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsReadOnlyRootFilesystem: true

# Pod Security Policy
podSecurityPolicy:
  privileged: false
```

### Namespace Isolation
```bash
# Create namespace
kubectl create namespace production

# Deploy to namespace
kubectl apply -f deployment.yaml -n production

# Set resource quotas
kubectl create quota compute-quota \
  --hard=requests.cpu=10,requests.memory=20Gi \
  --namespace=production
```

## Troubleshooting {#troubleshooting}

### Debugging Commands

```bash
# View pod events
kubectl describe pod myapp-pod

# View logs
kubectl logs myapp-pod
kubectl logs myapp-pod -c container-name
kubectl logs -f myapp-pod  # Follow

# Check resource usage
kubectl top pods
kubectl top nodes

# Debug pod network
kubectl exec -it myapp-pod -- nslookup myapp-service
kubectl exec -it myapp-pod -- curl http://myapp-service:80

# View cluster information
kubectl cluster-info
kubectl get nodes -o wide
kubectl describe node node-name

# Verify DNS
kubectl run -it --rm debug --image=alpine --restart=Never -- sh
# Inside pod: nslookup myapp-service

# Check node issues
kubectl get nodes
kubectl describe node node-name
```

### Common Issues

**Pod Pending**
```bash
# Check events
kubectl describe pod myapp-pod

# Check resource availability
kubectl top nodes

# Check PVC status
kubectl get pvc
```

**Pod CrashLoopBackOff**
```bash
# Check logs
kubectl logs myapp-pod

# Increase restart delay
kubectl set env deployment myapp --restart-policy=Never
```

**Service can't reach pod**
```bash
# Verify service selector
kubectl get pod -l app=myapp

# Test connectivity
kubectl run -it --rm debug --image=alpine --restart=Never -- sh
nslookup myapp-service
curl http://myapp-service:80
```

---

## Quick Reference

```bash
# Basic commands
kubectl create -f manifest.yaml
kubectl apply -f manifest.yaml
kubectl get all
kubectl describe pod myapp-pod
kubectl logs myapp-pod -f
kubectl exec -it myapp-pod -- bash

# Scaling & Updates
kubectl scale deployment myapp --replicas=5
kubectl set image deployment/myapp myapp=myapp:2.0
kubectl rollout undo deployment/myapp

# Cleanup
kubectl delete pod myapp-pod
kubectl delete deployment myapp-deployment
```

**Learn More**: https://kubernetes.io/docs/