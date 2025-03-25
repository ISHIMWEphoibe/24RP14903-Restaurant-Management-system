# Restaurant Management System

## Overview
This is a microservices-based restaurant management system that handles menu management, order processing, and backend operations. The system is containerized using Docker and deployed on Kubernetes, with a robust CI/CD pipeline implemented using Jenkins.

## System Architecture

The system consists of three main components:

1. **Backend Service**
   - Main application backend
   - Handles core business logic and data management

2. **Menu Service**
   - Manages menu items, categories, and pricing
   - Provides menu-related APIs

3. **Orders Service**
   - Processes customer orders
   - Manages order status and tracking

## Prerequisites

- Node.js (Latest LTS version)
- Docker
- Kubernetes cluster
- Jenkins
- Access to a Docker registry

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd restaurant-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Start local development server:
   ```bash
   npm start
   ```

## Deployment Process

### Docker Images

The system uses three Docker images:
- `restaurant-backend`: Main backend service
- `menu-service`: Menu management service
- `orders-service`: Order processing service

Images are automatically built and tagged with both the build number and 'latest' tag.

### CI/CD Pipeline

The Jenkins pipeline (`Jenkinsfile`) automates the following processes:

1. **Code Checkout**
   - Pulls the latest code from the repository

2. **Dependency Installation**
   - Installs required npm packages

3. **Testing**
   - Runs the test suite

4. **Docker Build**
   - Builds Docker images for all services in parallel
   - Tags images with build number and 'latest'

5. **Image Push**
   - Pushes images to the configured Docker registry

6. **Kubernetes Deployment**
   - Deploys the application to Kubernetes cluster
   - Applies necessary configurations and ingress rules

### Kubernetes Deployment

The application is deployed to Kubernetes using the following manifests:
- `k8s/backend-deployment.yaml`: Backend service deployment
- `k8s/microservice-deployment.yaml`: Microservices deployment
- `k8s/nginx-ingress.yaml`: Ingress configuration

## Security Measures

1. **Credentials Management**
   - Sensitive credentials are managed through Jenkins credentials store
   - Kubernetes configuration is stored securely
   - Docker registry credentials are managed securely

2. **Container Security**
   - Latest base images are used
   - Regular security updates
   - Minimal required permissions

3. **Network Security**
   - Ingress rules control external access
   - Inter-service communication is secured
   - TLS encryption for external traffic

## Environment Variables

The following environment variables need to be configured:

```
DOCKER_REGISTRY=your-registry
KUBE_CONFIG=kubernetes-config
```

## Monitoring and Logging

- Kubernetes dashboard for cluster monitoring
- Container logs available through Kubernetes
- Application-level logging implemented

## Troubleshooting

1. **Pipeline Failures**
   - Check Jenkins build logs
   - Verify Docker registry access
   - Ensure Kubernetes cluster is accessible

2. **Deployment Issues**
   - Check Kubernetes pod status
   - Verify ingress configuration
   - Check service logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]