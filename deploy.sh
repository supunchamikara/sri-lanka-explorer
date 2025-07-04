#!/bin/bash

# Sri Lanka Explorer - Quick Deployment Script

echo "🚀 Starting deployment process..."

# Step 1: Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Step 2: Check if dist folder exists
if [ -d "dist" ]; then
    echo "✅ Build artifacts ready in dist/ folder"
    echo "📁 Build size:"
    du -sh dist/
else
    echo "❌ Build folder not found!"
    exit 1
fi

echo ""
echo "🎉 Frontend is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Render:"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'backend'"
echo "   - Add environment variables (see .env.example)"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Run: vercel --prod"
echo "   - Or upload dist/ folder to Vercel dashboard"
echo "   - Set VITE_API_URL environment variable"
echo ""
echo "3. Configure MongoDB Atlas:"
echo "   - Create cluster at https://cloud.mongodb.com"
echo "   - Get connection string"
echo "   - Whitelist deployment IPs"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
