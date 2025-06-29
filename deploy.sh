#!/bin/bash

# Food Business App Deployment Script
# This script automates the deployment of the food business application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Function to create .env file if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_warning "Please edit .env file with your production settings before continuing."
        print_warning "Press Enter when you're ready to continue..."
        read -r
    else
        print_success ".env file found"
    fi
}

# Function to build and start services
deploy_services() {
    local environment=${1:-development}
    
    print_status "Deploying services in $environment mode..."
    
    if [ "$environment" = "production" ]; then
        docker-compose -f docker-compose.prod.yml --env-file .env up -d --build
    else
        docker-compose --env-file .env up -d --build
    fi
    
    print_success "Services deployed successfully"
}

# Function to wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for database
    print_status "Waiting for database..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
            print_success "Database is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Database failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
            print_success "Redis is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Redis failed to start within 30 seconds"
        exit 1
    fi
    
    # Wait for backend
    print_status "Waiting for backend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:8000/health/ > /dev/null 2>&1; then
            print_success "Backend is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Backend failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3000/ > /dev/null 2>&1; then
            print_success "Frontend is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Frontend failed to start within 60 seconds"
        exit 1
    fi
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec -T backend python manage.py migrate
    print_success "Migrations completed"
}

# Function to create superuser
create_superuser() {
    print_status "Creating superuser..."
    docker-compose exec -T backend python manage.py createsuperuser --noinput || true
    print_success "Superuser creation completed"
}

# Function to collect static files
collect_static() {
    print_status "Collecting static files..."
    docker-compose exec -T backend python manage.py collectstatic --noinput
    print_success "Static files collected"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    echo ""
    print_status "Service URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8000"
    echo "Health Check: http://localhost:8000/health/"
    echo "Admin Panel: http://localhost:8000/admin/"
}

# Function to show logs
show_logs() {
    print_status "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    local environment=${1:-development}
    
    print_status "Stopping services..."
    
    if [ "$environment" = "production" ]; then
        docker-compose -f docker-compose.prod.yml down
    else
        docker-compose down
    fi
    
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker system prune -f
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    local environment=${1:-development}
    
    print_status "Starting deployment for $environment environment..."
    
    # Pre-deployment checks
    check_docker
    check_docker_compose
    setup_env
    
    # Stop existing services if running
    stop_services "$environment"
    
    # Deploy services
    deploy_services "$environment"
    
    # Wait for services to be ready
    wait_for_services
    
    # Post-deployment tasks
    run_migrations
    collect_static
    create_superuser
    
    # Show final status
    show_status
    
    print_success "Deployment completed successfully!"
    print_status "You can now access your application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo ""
    print_status "To view logs, run: ./deploy.sh logs"
    print_status "To stop services, run: ./deploy.sh stop"
}

# Command line argument handling
case "${1:-deploy}" in
    "deploy")
        main "${2:-development}"
        ;;
    "production")
        main "production"
        ;;
    "stop")
        stop_services "${2:-development}"
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Food Business App Deployment Script"
        echo ""
        echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
        echo ""
        echo "Commands:"
        echo "  deploy      Deploy the application (default)"
        echo "  production  Deploy in production mode"
        echo "  stop        Stop all services"
        echo "  logs        Show service logs"
        echo "  status      Show service status"
        echo "  cleanup     Clean up Docker resources"
        echo "  help        Show this help message"
        echo ""
        echo "Environments:"
        echo "  development (default)"
        echo "  production"
        echo ""
        echo "Examples:"
        echo "  $0                    # Deploy in development mode"
        echo "  $0 deploy production  # Deploy in production mode"
        echo "  $0 stop production    # Stop production services"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac 