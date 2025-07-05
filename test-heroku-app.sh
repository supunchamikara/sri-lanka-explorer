#!/bin/bash

# 🧪 Test Heroku App After MongoDB Atlas Fix

APP_NAME="tapro"
API_URL="https://tapro-3c3bc3ed4b88.herokuapp.com"

echo "🧪 Testing Heroku App: $APP_NAME"
echo "🌐 API URL: $API_URL"
echo "=================================="

echo "📊 App Status:"
heroku ps --app $APP_NAME

echo ""
echo "📋 Environment Variables:"
heroku config --app $APP_NAME

echo ""
echo "📝 Recent Logs (last 10 lines):"
heroku logs --app $APP_NAME --num 10

echo ""
echo "🔍 Testing API Endpoints:"

echo ""
echo "1. Health Check:"
echo "   GET $API_URL/api/health"
HEALTH_RESPONSE=$(curl -s "$API_URL/api/health" | head -3)
echo "   Response: $HEALTH_RESPONSE"

echo ""
echo "2. Database Connection Test:"
echo "   GET $API_URL/api/test-connection"
DB_RESPONSE=$(curl -s "$API_URL/api/test-connection" | head -3)
echo "   Response: $DB_RESPONSE"

echo ""
echo "🎯 Quick Tests:"
if [[ $HEALTH_RESPONSE == *"status"* ]]; then
    echo "✅ Health endpoint working!"
else
    echo "❌ Health endpoint not responding properly"
fi

if [[ $DB_RESPONSE == *"Connected"* ]]; then
    echo "✅ Database connection working!"
else
    echo "❌ Database connection issues"
fi

echo ""
echo "📚 If still having issues:"
echo "1. Check MongoDB Atlas Network Access settings"
echo "2. Ensure 0.0.0.0/0 is whitelisted"
echo "3. Verify MongoDB URI is correct"
echo "4. Check logs: heroku logs --tail --app $APP_NAME"
