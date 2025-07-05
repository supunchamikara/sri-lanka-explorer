# Heroku Deployment Guide for Sri Lanka Explorer

## Prerequisites

1. Heroku CLI installed
2. Git repository initialized
3. MongoDB Atlas database set up

## Deployment Steps

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create Heroku App

```bash
heroku create your-app-name
# or
heroku create tapro-web-backend
```

### 3. Set Environment Variables

Set these in your Heroku dashboard (Settings > Config Vars) or via CLI:

```bash
# MongoDB connection string
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/tapro?retryWrites=true&w=majority"

# JWT Secret (use a strong random string)
heroku config:set JWT_SECRET="your-super-secret-jwt-key-here"

# Frontend URL for CORS
heroku config:set FRONTEND_URL="https://your-frontend-domain.netlify.app"
heroku config:set CORS_ORIGIN="https://your-frontend-domain.netlify.app"

# Node environment
heroku config:set NODE_ENV="production"
```

### 4. Deploy to Heroku

```bash
# Add Heroku remote (if not already added)
heroku git:remote -a your-app-name

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 5. Verify Deployment

```bash
# Check logs
heroku logs --tail

# Open your app
heroku open
```

## Important Notes

1. **File Structure**: This deployment serves only the backend API. The frontend should be deployed separately to Netlify/Vercel.

2. **Environment Variables**: Never commit .env files. Set all environment variables in Heroku dashboard.

3. **MongoDB**: Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Heroku's IP ranges.

4. **CORS**: Update the CORS_ORIGIN environment variable to match your frontend domain.

5. **File Uploads**: Files uploaded to `/uploads/experiences/` will be stored on Heroku's ephemeral filesystem and may be lost during dyno restarts. Consider using AWS S3 or Cloudinary for production file storage.

## Testing

Your API will be available at: `https://your-app-name.herokuapp.com`

Test the connection: `https://your-app-name.herokuapp.com/api/test-connection`

## Frontend Configuration

Update your frontend's API URL to point to your Heroku backend:

```
VITE_API_URL=https://your-app-name.herokuapp.com
```
