#!/bin/bash

# 🔧 Quick Fix Script for Heroku Deployment Issues
# Run this after installing Heroku CLI

APP_NAME="tapro-3c3bc3ed4b88"

echo "🔧 Quick Fix for Heroku App: $APP_NAME"
echo "=================================="

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed!"
    echo "Please install it first:"
    echo "brew tap heroku/brew && brew install heroku"
    echo "Or visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login check
echo "🔐 Checking Heroku authentication..."
if ! heroku auth:whoami &> /dev/null; then
    echo "Please login to Heroku first:"
    heroku login
fi

echo "📊 Checking current app status..."
heroku ps --app $APP_NAME

echo ""
echo "⚙️  Checking environment variables..."
heroku config --app $APP_NAME

echo ""
echo "📋 Required environment variables:"
echo "- MONGODB_URI (for database connection)"
echo "- JWT_SECRET (for authentication)"
echo "- NODE_ENV (should be 'production')"
echo "- FRONTEND_URL (for CORS)"

echo ""
echo "🔍 Recent logs (last 100 lines):"
heroku logs --num 100 --app $APP_NAME

echo ""
echo "🛠️  Quick fixes you can try:"
echo ""
echo "1. Set missing environment variables:"
echo "   heroku config:set MONGODB_URI='your_mongodb_uri' --app $APP_NAME"
echo "   heroku config:set JWT_SECRET='your_jwt_secret' --app $APP_NAME"
echo "   heroku config:set NODE_ENV='production' --app $APP_NAME"
echo ""
echo "2. Restart the app:"
echo "   heroku restart --app $APP_NAME"
echo ""
echo "3. Trigger a rebuild:"
echo "   git commit --allow-empty -m 'Trigger rebuild'"
echo "   git push heroku main"
echo ""
echo "4. Test the API:"
echo "   curl https://$APP_NAME.herokuapp.com/api/health"

echo ""
read -p "Do you want to restart the app now? (y/n): " restart_app
if [ "$restart_app" = "y" ]; then
    echo "🔄 Restarting app..."
    heroku restart --app $APP_NAME
    echo "✅ App restarted!"
    
    echo "⏳ Waiting 10 seconds for app to start..."
    sleep 10
    
    echo "🧪 Testing health endpoint..."
    curl -s "https://$APP_NAME.herokuapp.com/api/health" | head -10
fi

echo ""
echo "📚 For more detailed troubleshooting, see:"
echo "- HEROKU_TROUBLESHOOTING.md"
echo "- Heroku logs: heroku logs --tail --app $APP_NAME"
