# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB (for local development without Docker)
- Redis (for local development without Docker)

## Quick Start with Docker

### Development Environment

1. Clone the repository:
```bash
git clone <repository-url>
cd holiday-tier-list
```

2. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. The application will be available at:
- Backend API: http://localhost:5000
- Frontend: Start locally with `npm start` in the frontend directory

### Production Environment

1. Build and start all services:
```bash
docker-compose up -d
```

2. The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api

## Local Development Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/holiday-tier-list
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h
NODE_ENV=development
```

## Database Setup

The application will automatically connect to MongoDB and create the necessary collections. No manual database setup is required.

## Production Deployment

### Using Docker

1. Update environment variables in `docker-compose.yml`
2. Build and deploy:
```bash
docker-compose up -d --build
```

### Manual Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Serve the built files with nginx or your preferred web server
3. Deploy the backend to your server
4. Configure reverse proxy to route API requests to the backend

## Health Checks

- Backend health endpoint: `GET /api/health`
- Frontend: The app should load at the root URL

## Troubleshooting

1. **Database connection issues**: Verify MongoDB is running and connection string is correct
2. **Redis connection issues**: Verify Redis is running and accessible
3. **CORS issues**: Check that the frontend URL is properly configured in the backend
4. **Build failures**: Ensure Node.js version is 18+ and dependencies are properly installed