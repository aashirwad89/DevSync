# Docker - Complete Guide for DevSync

## Table of Contents
1. [Introduction to Docker](#introduction)
2. [Installation & Setup](#installation)
3. [Core Concepts](#core-concepts)
4. [Docker Commands](#commands)
5. [Dockerfile Best Practices](#dockerfile)
6. [Docker Compose](#compose)
7. [Networking](#networking)
8. [Volumes & Data Management](#volumes)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

## Introduction to Docker {#introduction}

Docker is a containerization platform that packages applications with all dependencies into isolated containers. Each container is a lightweight, standalone executable package that includes code, runtime, system tools, and libraries.

### Benefits
- **Consistency**: "Works on my machine" problem solved
- **Isolation**: Each container runs independently
- **Portability**: Run anywhere - laptop, server, cloud
- **Efficiency**: Lightweight compared to VMs
- **Scalability**: Easy to scale horizontally

### Key Terminology
- **Image**: Lightweight, read-only template (like a blueprint)
- **Container**: Running instance of an image (like a process)
- **Registry**: Repository for images (Docker Hub, ECR, GCR)
- **Dockerfile**: Script to build custom images
- **Docker Compose**: Tool to run multi-container applications

## Installation & Setup {#installation}

### Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt-get update

# Install Docker
sudo apt-get install docker.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Add user to docker group (no sudo needed)
sudo usermod -aG docker $USER
```

### macOS
```bash
# Using Homebrew
brew install docker docker-compose

# Or download Docker Desktop from docker.com
```

### Windows
- Download Docker Desktop from docker.com
- Install WSL 2 (Windows Subsystem for Linux 2)
- Follow installation wizard

## Core Concepts {#core-concepts}

### Docker Architecture
```
┌─────────────────────────────────────┐
│      Docker Client (CLI)            │
└────────────┬────────────────────────┘
             │
             ├─→ docker build, run, push
             │
┌────────────▼────────────────────────┐
│    Docker Daemon (dockerd)          │
├─────────────────────────────────────┤
│ • Manages images                    │
│ • Creates containers                │
│ • Manages volumes & networks        │
└────────────┬────────────────────────┘
             │
     ┌───────┴───────┐
     ▼               ▼
┌─────────┐   ┌──────────────┐
│ Images  │   │  Registries  │
└─────────┘   └──────────────┘
     │
     ├─→ Container 1
     ├─→ Container 2
     └─→ Container 3
```

### Image vs Container
**Image**: Immutable template (stored on disk)
```bash
# List images
docker images

# Pull image from registry
docker pull ubuntu:20.04

# Build custom image
docker build -t myapp:1.0 .
```

**Container**: Running instance (temporary)
```bash
# Create and run container
docker run -d -p 8000:8000 myapp:1.0

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a
```

## Docker Commands {#commands}

### Image Management
```bash
# Search images
docker search nginx

# Pull image
docker pull node:18-alpine

# Build image from Dockerfile
docker build -t appname:tag .

# Tag image
docker tag myapp:1.0 myrepo/myapp:1.0

# Push to registry
docker push myrepo/myapp:1.0

# Remove image
docker rmi image_id

# Inspect image details
docker inspect myapp:1.0

# View image history
docker history myapp:1.0
```

### Container Management
```bash
# Run container (detached mode)
docker run -d --name mycontainer -p 8000:8000 myapp:1.0

# Run with environment variables
docker run -d -e NODE_ENV=production -e PORT=3000 myapp

# Run with volume mount
docker run -d -v /host/path:/container/path myapp:1.0

# Run interactive (bash into container)
docker run -it ubuntu:20.04 /bin/bash

# Start stopped container
docker start container_id

# Stop running container
docker stop container_id

# Kill container (force stop)
docker kill container_id

# Remove container
docker rm container_id

# View container logs
docker logs container_id
docker logs -f container_id  # Follow logs

# View container processes
docker top container_id

# Execute command in running container
docker exec -it container_id bash
docker exec container_id npm test

# Copy files from container
docker cp container_id:/app/file.txt ./local/path

# Copy files to container
docker cp ./local/file.txt container_id:/app/
```

### Debugging & Monitoring
```bash
# View container stats (CPU, memory, network)
docker stats

# View container details
docker inspect container_id

# View container processes
docker top container_id

# View container logs with timestamp
docker logs --timestamps container_id

# View last 100 lines of logs
docker logs --tail 100 container_id

# View resource usage
docker system df

# Clean up unused resources
docker system prune
```

## Dockerfile Best Practices {#dockerfile}

### Dockerfile Structure
```dockerfile
# 1. Use specific base image version (not 'latest')
FROM node:18-alpine

# 2. Set metadata
LABEL maintainer="team@devsync.com"
LABEL version="1.0"
LABEL description="DevSync backend API"

# 3. Set working directory
WORKDIR /app

# 4. Copy package files
COPY package*.json ./

# 5. Install dependencies
RUN npm ci --only=production

# 6. Copy application code
COPY . .

# 7. Expose port
EXPOSE 8000

# 8. Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# 9. Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# 10. Define entrypoint
ENTRYPOINT ["node"]
CMD ["server.js"]
```

### Multi-Stage Build (Optimize for size)
```dockerfile
# Stage 1: Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Runtime stage (smaller image)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]
```

### .dockerignore File
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.DS_Store
coverage
dist
build
.next
.venv
__pycache__
```

### Best Practices
1. **Use specific base image versions**: `node:18-alpine` not `node:latest`
2. **Minimize layers**: Combine RUN commands with `&&`
3. **Use .dockerignore**: Exclude unnecessary files
4. **Run as non-root user**: Security best practice
5. **Use multi-stage builds**: Reduce final image size
6. **Cache layers**: Order commands by change frequency
7. **Keep images small**: Use alpine variants
8. **Use COPY instead of ADD**: More explicit

### Production-Ready Dockerfile Example
```dockerfile
FROM node:18-alpine

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm ci --only=production

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
```

## Docker Compose {#compose}

### Basic docker-compose.yml
```yaml
version: '3.8'

services:
  # Backend API
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: devsync-api
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/devsync
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs
    networks:
      - devsync-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # MongoDB Database
  mongo:
    image: mongo:6.0-alpine
    container_name: devsync-mongo
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
      - MONGO_INITDB_DATABASE=devsync
    volumes:
      - mongo-data:/data/db
      - mongo-config:/data/configdb
    networks:
      - devsync-network
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: devsync-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - devsync-network
    restart: unless-stopped
    command: redis-server --appendonly yes

  # Frontend (Optional)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: devsync-frontend
    ports:
      - "3000:3000"
    depends_on:
      - api
    networks:
      - devsync-network
    environment:
      - REACT_APP_API_URL=http://api:8000

volumes:
  mongo-data:
    driver: local
  mongo-config:
    driver: local
  redis-data:
    driver: local

networks:
  devsync-network:
    driver: bridge
```

### Docker Compose Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Build images
docker-compose build

# Build and start
docker-compose up -d --build

# View running services
docker-compose ps

# View logs
docker-compose logs
docker-compose logs -f api  # Follow specific service
docker-compose logs --tail=50 api

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove with volumes
docker-compose down -v

# Execute command in service
docker-compose exec api npm test
docker-compose exec mongo mongosh

# Scale services
docker-compose up -d --scale worker=3

# View config (resolved)
docker-compose config
```

## Networking {#networking}

### Network Types
```bash
# Bridge (default): Isolated network
docker run --network bridge myapp

# Host: Share host network
docker run --network host myapp

# None: No networking
docker run --network none myapp

# Custom bridge: Better service discovery
docker network create mynetwork
docker run --network mynetwork myapp
```

### Service Discovery
In Docker Compose, services can communicate using service name:

```javascript
// In Node.js
const mongoUrl = 'mongodb://mongo:27017/devsync';  // 'mongo' is service name
const redisUrl = 'redis://redis:6379';              // 'redis' is service name
```

## Volumes & Data Management {#volumes}

### Volume Types
```bash
# Named volume (managed by Docker)
docker volume create mydata
docker run -v mydata:/data myapp

# Bind mount (host directory)
docker run -v /host/path:/container/path myapp

# Tmpfs mount (temporary, memory-based)
docker run --tmpfs /temp myapp
```

### Volume Commands
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Clean unused volumes
docker volume prune
```

### Docker Compose Volumes
```yaml
services:
  mongo:
    image: mongo:6.0
    volumes:
      # Named volume (persistent)
      - mongo-data:/data/db
      # Bind mount (local directory)
      - ./init-scripts:/docker-entrypoint-initdb.d
      # Readonly mount
      - ./config:/etc/config:ro

volumes:
  mongo-data:
    driver: local
```

## Security {#security}

### Container Security Best Practices

1. **Use Read-Only Root Filesystem**
```bash
docker run --read-only --tmpfs /tmp myapp
```

2. **Run as Non-Root User**
```dockerfile
RUN useradd -m -u 1000 appuser
USER appuser
```

3. **Limit Resources**
```bash
docker run --memory 512m --cpus 1 myapp
```

4. **Use Security Options**
```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp
```

5. **Use Private Registry**
```bash
# Login to private registry
docker login private-registry.com

# Tag image
docker tag myapp:1.0 private-registry.com/myapp:1.0

# Push to private registry
docker push private-registry.com/myapp:1.0
```

6. **Scan for Vulnerabilities**
```bash
# Using Docker Scout (built-in)
docker scout cves myapp:1.0

# Using Trivy
trivy image myapp:1.0
```

## Troubleshooting {#troubleshooting}

### Common Issues

**Container exits immediately**
```bash
# Check logs
docker logs container_id

# Run interactive to debug
docker run -it myapp:1.0 /bin/bash
```

**Port already in use**
```bash
# Kill process on port
sudo lsof -i :8000
sudo kill -9 <PID>

# Or use different port
docker run -p 8001:8000 myapp:1.0
```

**Out of disk space**
```bash
# Clean up unused resources
docker system prune -a --volumes

# Remove dangling images
docker image prune -a
```

**Memory issues**
```bash
# Increase Docker memory
# Edit ~/.docker/config.json or Docker Desktop settings

# Limit container memory
docker run -m 512m myapp
```

**Container can't connect to service**
```bash
# Ensure on same network
docker run --network mynetwork myapp

# Check DNS resolution
docker exec mycontainer nslookup servicename
```

---

## Quick Reference

```bash
# Build and run
docker build -t myapp:1.0 .
docker run -d -p 8000:8000 myapp:1.0

# Check status
docker ps
docker logs container_id

# Stop and clean
docker stop container_id
docker rm container_id

# Multi-container with compose
docker-compose up -d
docker-compose down
```

**Learn More**: https://docs.docker.com