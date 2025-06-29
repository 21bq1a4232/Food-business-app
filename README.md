# Food Business Application

A full-stack food business application built with Django (backend) and React (frontend), featuring order management, payment processing, and user authentication.

## 🚀 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- At least 4GB of available RAM
- Ports 3000, 8000, 5432, and 6379 available

### Development Deployment

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd food-business-app
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy the application**
   ```bash
   ./deploy.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin/
   - Health Check: http://localhost:8000/health/

### Production Deployment

1. **Configure production environment**
   ```bash
   cp env.example .env
   # Edit .env with production settings
   ```

2. **Deploy in production mode**
   ```bash
   ./deploy.sh production
   ```

## 📁 Project Structure

```
food-business-app/
├── backend/                 # Django backend
│   ├── Dockerfile          # Backend container configuration
│   ├── requirements.txt    # Python dependencies
│   ├── manage.py          # Django management script
│   ├── food_business/     # Django project settings
│   ├── products/          # Products app
│   ├── cart/              # Shopping cart app
│   ├── orders/            # Order management app
│   ├── users/             # User management app
│   ├── payments/          # Payment processing app
│   └── health/            # Health check endpoints
├── frontend/              # React frontend
│   ├── Dockerfile         # Frontend container configuration
│   ├── package.json       # Node.js dependencies
│   ├── nginx.conf         # Nginx configuration for frontend
│   └── src/               # React source code
├── nginx/                 # Nginx reverse proxy configuration
├── docker-compose.yml     # Development services orchestration
├── docker-compose.prod.yml # Production services orchestration
├── deploy.sh              # Deployment automation script
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🐳 Docker Services

### Development Services
- **Frontend**: React app served by Nginx (port 3000)
- **Backend**: Django app with Gunicorn (port 8000)
- **Database**: PostgreSQL 15 (port 5432)
- **Cache**: Redis 7 (port 6379)
- **Celery Worker**: Background task processing
- **Celery Beat**: Scheduled task processing

### Production Services
- **Nginx**: Reverse proxy with SSL termination (ports 80, 443)
- **Frontend**: Optimized React build
- **Backend**: Production-optimized Django with multiple workers
- **Database**: PostgreSQL with persistent storage
- **Cache**: Redis with authentication
- **Celery**: Background task processing with resource limits

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database Settings
DB_NAME=food_business
DB_USER=postgres
DB_PASSWORD=secure-password
DB_HOST=db
DB_PORT=5432

# Redis Settings
REDIS_URL=redis://redis:6379/1
REDIS_PASSWORD=secure-redis-password

# Payment Gateway Settings
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Email Settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

### SSL Configuration (Production)

1. **Generate SSL certificates**
   ```bash
   mkdir -p nginx/ssl
   # Add your SSL certificates to nginx/ssl/
   ```

2. **Update nginx configuration**
   - Uncomment HTTPS server block in `nginx/nginx.conf`
   - Update server_name with your domain

## 🚀 Deployment Commands

### Using the Deployment Script

```bash
# Development deployment
./deploy.sh

# Production deployment
./deploy.sh production

# Stop services
./deploy.sh stop

# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Clean up Docker resources
./deploy.sh cleanup

# Show help
./deploy.sh help
```

### Manual Docker Commands

```bash
# Development
docker-compose up -d --build

# Production
docker-compose -f docker-compose.prod.yml --env-file .env up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Access backend shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Application Health**: `http://localhost:8000/health/`
- **Database**: Automatic health checks in Docker Compose
- **Redis**: Automatic health checks in Docker Compose

### Logs
```bash
# All services
./deploy.sh logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Performance Monitoring
- **Resource Usage**: `docker stats`
- **Container Status**: `docker-compose ps`
- **Service Health**: Health check endpoints

## 🔒 Security Features

### Production Security
- Non-root containers
- Resource limits
- Health checks
- Rate limiting (Nginx)
- Security headers
- SSL/TLS encryption
- Environment variable isolation

### Database Security
- PostgreSQL with authentication
- Persistent volume storage
- Network isolation
- Regular backups (recommended)

### Application Security
- Django security middleware
- CORS configuration
- JWT authentication
- Input validation
- SQL injection protection

## 🛠️ Development

### Adding New Features
1. **Backend**: Add Django apps in `backend/`
2. **Frontend**: Add React components in `frontend/src/`
3. **Database**: Create and run migrations
4. **Testing**: Add tests to respective apps

### Database Migrations
```bash
# Create migration
docker-compose exec backend python manage.py makemigrations

# Apply migration
docker-compose exec backend python manage.py migrate
```

### Static Files
```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend workers
docker-compose up -d --scale backend=3

# Scale Celery workers
docker-compose up -d --scale celery_worker=2
```

### Resource Optimization
- Adjust memory limits in docker-compose files
- Optimize Gunicorn workers based on CPU cores
- Configure Redis memory limits
- Use CDN for static files in production

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :8000
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs db
   ```

3. **Memory issues**
   ```bash
   # Check resource usage
   docker stats
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Debug Mode
```bash
# Enable debug mode
echo "DEBUG=True" >> .env
docker-compose restart backend
```

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the logs for error messages
- Ensure all prerequisites are met
