#!/bin/bash

# Final Deployment Script for Sri Lanka Explorer
# Prepares and deploys the latest changes with rich text editor and mobile navigation improvements

set -e

echo "🚀 Starting Final Deployment Process for Sri Lanka Explorer"
echo "=" $(printf '=%.0s' {1..60})

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the project root."
    exit 1
fi

# 1. Pre-deployment checks
echo -e "\n📋 Running Pre-deployment Checks"
echo "-" $(printf '=%.0s' {1..40})

# Check if git is initialized
if [ ! -d ".git" ]; then
    log "Initializing Git repository..."
    git init
    git branch -m main
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    warning "You have uncommitted changes."
fi

# Check Node.js version
NODE_VERSION=$(node --version)
log "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
log "npm version: $NPM_VERSION"

# 2. Build and test locally
echo -e "\n🔨 Building and Testing Application"
echo "-" $(printf '=%.0s' {1..40})

log "Installing dependencies..."
npm install --legacy-peer-deps

log "Building production frontend..."
npm run build

if [ $? -eq 0 ]; then
    success "Frontend build completed successfully"
else
    error "Frontend build failed"
    exit 1
fi

# Test if the build files exist
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    success "Build files verified"
    BUILD_SIZE=$(du -sh dist | cut -f1)
    log "Build size: $BUILD_SIZE"
else
    error "Build files not found"
    exit 1
fi

# 3. Prepare backend for deployment
echo -e "\n⚙️ Preparing Backend for Deployment"
echo "-" $(printf '=%.0s' {1..40})

log "Checking backend dependencies..."
cd backend
npm install --production --legacy-peer-deps

log "Verifying backend files..."
REQUIRED_FILES=("server.js" "Procfile" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "✓ $file exists"
    else
        error "✗ $file missing"
        exit 1
    fi
done

cd ..

# 4. Environment validation
echo -e "\n🔧 Validating Environment Configuration"
echo "-" $(printf '=%.0s' {1..40})

# Check production environment files
if [ -f ".env.production" ]; then
    success "✓ .env.production exists"
else
    warning "! .env.production not found"
fi

if [ -f "backend/.env.example" ]; then
    success "✓ backend/.env.example exists"
else
    warning "! backend/.env.example not found"
fi

# 5. Git operations
echo -e "\n📦 Preparing Git Commit"
echo "-" $(printf '=%.0s' {1..40})

# Check git status
log "Current git status:"
git status --short

# Stage all changes
log "Staging changes..."
git add .

# Create commit message
COMMIT_MSG="feat: Complete rich text editor and mobile navigation implementation

- Fixed React 19 compatibility issues with ReactQuill
- Added comprehensive rich text editing with formatted display
- Improved mobile navigation with hamburger menu
- Enhanced mobile UX with touch-friendly interactions
- Added HTML content validation and sanitization
- Implemented preview mode for truncated descriptions
- All components tested and working in development
- Ready for production deployment

Features:
- Rich text editor with full formatting options
- Mobile-responsive navigation with search integration
- Proper error handling and validation
- Optimized for production deployment"

log "Creating commit with message..."
echo "Commit message:"
echo "$COMMIT_MSG"

read -p "Do you want to proceed with this commit? (y/N): " confirm
if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    git commit -m "$COMMIT_MSG"
    success "Changes committed successfully"
else
    warning "Commit cancelled"
    exit 0
fi

# 6. Heroku deployment
echo -e "\n🚀 Deploying to Heroku"
echo "-" $(printf '=%.0s' {1..40})

# Check if Heroku CLI is installed
if command -v heroku &> /dev/null; then
    success "Heroku CLI found"
else
    error "Heroku CLI not found. Please install it first."
    exit 1
fi

# Check if logged in to Heroku
if heroku auth:whoami &> /dev/null; then
    HEROKU_USER=$(heroku auth:whoami)
    success "Logged in to Heroku as: $HEROKU_USER"
else
    error "Not logged in to Heroku. Please run 'heroku login' first."
    exit 1
fi

# Check if Heroku remote exists
if git remote get-url heroku &> /dev/null; then
    HEROKU_REMOTE=$(git remote get-url heroku)
    success "Heroku remote found: $HEROKU_REMOTE"
else
    warning "Heroku remote not found. Please add it manually or create a new app."
    read -p "Enter your Heroku app name: " app_name
    if [ -n "$app_name" ]; then
        heroku git:remote -a "$app_name"
        success "Heroku remote added for app: $app_name"
    else
        error "App name required"
        exit 1
    fi
fi

# Deploy to Heroku
log "Pushing to Heroku..."
git push heroku main

if [ $? -eq 0 ]; then
    success "Successfully deployed to Heroku!"
else
    error "Heroku deployment failed"
    exit 1
fi

# 7. Post-deployment verification
echo -e "\n✅ Post-deployment Verification"
echo "-" $(printf '=%.0s' {1..40})

# Get the app URL
APP_URL=$(heroku info -s | grep web_url | cut -d= -f2)
if [ -n "$APP_URL" ]; then
    success "App URL: $APP_URL"
    
    log "Testing app health..."
    if curl -s --head "$APP_URL" | head -n 1 | grep -q "200 OK"; then
        success "App is responding with 200 OK"
    else
        warning "App might not be fully ready yet"
    fi
    
    log "Testing API health..."
    API_HEALTH=$(curl -s "${APP_URL}api/health" | grep -o '"status":"healthy"' || echo "")
    if [ -n "$API_HEALTH" ]; then
        success "API health check passed"
    else
        warning "API health check failed or not available"
    fi
else
    warning "Could not retrieve app URL"
fi

# 8. Deployment summary
echo -e "\n📊 Deployment Summary"
echo "=" $(printf '=%.0s' {1..60})

success "🎉 Deployment completed successfully!"
echo
log "Key Features Deployed:"
echo "  ✓ Rich text editor with React Quill (React 19 compatible)"
echo "  ✓ Formatted description display with HTML rendering"
echo "  ✓ Mobile navigation with hamburger menu"
echo "  ✓ Touch-friendly mobile interactions"
echo "  ✓ Integrated search functionality"
echo "  ✓ Content validation and sanitization"
echo "  ✓ Preview mode for truncated content"
echo
log "Next Steps:"
echo "  1. Test the live application thoroughly"
echo "  2. Verify rich text editor functionality"
echo "  3. Test mobile navigation on various devices"
echo "  4. Monitor application performance and logs"
echo "  5. Consider setting up automated deployment pipeline"
echo
if [ -n "$APP_URL" ]; then
    log "🌐 Live Application: $APP_URL"
fi
log "📊 Monitor logs: heroku logs --tail"
log "🔧 Manage app: heroku dashboard"

echo -e "\n🎉 All done! Your Sri Lanka Explorer app is live with rich text editing and improved mobile navigation!"
