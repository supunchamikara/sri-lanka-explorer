#!/bin/bash

# Sri Lanka Explorer - Heroku Deployment Script

echo "🚀 Starting Heroku deployment for Sri Lanka Explorer Backend..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ You are not logged in to Heroku. Please login first."
    echo "Run: heroku login"
    exit 1
fi

# Get app name from user
read -p "Enter your Heroku app name (e.g., tapro-web-backend): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name is required!"
    exit 1
fi

# Check if app exists, if not create it
if ! heroku apps:info $APP_NAME &> /dev/null; then
    echo "📱 Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create Heroku app. The name might be taken."
        exit 1
    fi
else
    echo "📱 Using existing Heroku app: $APP_NAME"
fi

# Add Heroku remote
echo "🔗 Adding Heroku remote..."
heroku git:remote -a $APP_NAME

# Check if environment variables are set
echo "🔍 Checking environment variables..."
ENV_VARS=("MONGODB_URI" "JWT_SECRET" "NODE_ENV")
MISSING_VARS=()

for var in "${ENV_VARS[@]}"; do
    if ! heroku config:get $var -a $APP_NAME &> /dev/null; then
        MISSING_VARS+=($var)
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Missing environment variables: ${MISSING_VARS[*]}"
    echo "Please set them in your Heroku dashboard or run:"
    echo "heroku config:set MONGODB_URI='your_mongodb_uri' -a $APP_NAME"
    echo "heroku config:set JWT_SECRET='your_jwt_secret' -a $APP_NAME"
    echo "heroku config:set NODE_ENV='production' -a $APP_NAME"
    echo "heroku config:set FRONTEND_URL='https://your-frontend-domain.netlify.app' -a $APP_NAME"
    echo "heroku config:set CORS_ORIGIN='https://your-frontend-domain.netlify.app' -a $APP_NAME"
    
    read -p "Do you want to continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku - $(date)"
git push heroku main

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your API is available at: https://$APP_NAME.herokuapp.com"
    echo "🔗 Test connection: https://$APP_NAME.herokuapp.com/api/test-connection"
    
    echo "📋 Next steps:"
    echo "1. Update your frontend VITE_API_URL to: https://$APP_NAME.herokuapp.com"
    echo "2. Deploy your frontend to Netlify/Vercel"
    echo "3. Update CORS_ORIGIN in Heroku config to match your frontend domain"
    
    # Open app in browser
    read -p "Do you want to open the app in your browser? (y/n): " OPEN_APP
    if [ "$OPEN_APP" = "y" ]; then
        heroku open -a $APP_NAME
    fi
    
    # Show logs
    read -p "Do you want to see the logs? (y/n): " SHOW_LOGS
    if [ "$SHOW_LOGS" = "y" ]; then
        heroku logs --tail -a $APP_NAME
    fi
else
    echo "❌ Deployment failed! Check the logs:"
    heroku logs --tail -a $APP_NAME
    exit 1
fi
