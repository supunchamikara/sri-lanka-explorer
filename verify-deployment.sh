#!/bin/bash

# 🔍 Pre-Deployment Verification Script for Sri Lanka Explorer

echo "🔍 Verifying Heroku deployment readiness..."
echo "=========================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counters
CHECKS_PASSED=0
TOTAL_CHECKS=0

# Function to check and report
check_item() {
    local item_name="$1"
    local check_command="$2"
    local required="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if eval "$check_command"; then
        echo -e "${GREEN}✅ $item_name${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        if [ "$required" == "required" ]; then
            echo -e "${RED}❌ $item_name (REQUIRED)${NC}"
        else
            echo -e "${YELLOW}⚠️  $item_name (Optional)${NC}"
        fi
    fi
}

echo "📋 Checking file structure..."
check_item "Procfile exists" "[ -f Procfile ]" "required"
check_item "Backend package.json exists" "[ -f backend/package.json ]" "required"
check_item "Backend server.js exists" "[ -f backend/server.js ]" "required"
check_item "Root package.json exists" "[ -f package.json ]" "required"
check_item "Environment example exists" "[ -f backend/.env.example ]" "required"

echo ""
echo "⚙️  Checking package.json configuration..."
check_item "Root package.json has engines" "grep -q '\"engines\"' package.json" "required"
check_item "Root package.json has start script" "grep -q '\"start\"' package.json" "required"
check_item "Backend package.json has start script" "grep -q '\"start\"' backend/package.json" "required"

echo ""
echo "🔒 Checking security..."
check_item "Backend .env not in git" "! git ls-files | grep -q 'backend/\.env$'" "required"
check_item ".gitignore exists" "[ -f .gitignore ]" "required"
check_item "No hardcoded secrets in server.js" "! grep -E '(password|secret).*=.*[\"'\'']\\w+' backend/server.js" "required"

echo ""
echo "🌐 Checking CORS configuration..."
check_item "CORS configured in server.js" "grep -q 'cors' backend/server.js" "required"
check_item "Environment variables used for CORS" "grep -q 'process.env.*ORIGIN' backend/server.js" "required"

echo ""
echo "🗄️  Checking database configuration..."
check_item "MongoDB connection configured" "grep -q 'MONGODB_URI' backend/server.js" "required"
check_item "Database connection error handling" "grep -q 'catch.*error' backend/server.js" "required"

echo ""
echo "🛠️  Checking development tools..."
check_item "Heroku CLI installed" "command -v heroku > /dev/null 2>&1" "required"
check_item "Git repository initialized" "[ -d .git ]" "required"
check_item "Git remote exists" "git remote -v | grep -q '.'" "optional"

echo ""
echo "📦 Checking dependencies..."
if [ -f backend/package.json ]; then
    cd backend
    check_item "Backend dependencies installable" "npm install --dry-run > /dev/null 2>&1" "required"
    cd ..
fi

check_item "Frontend dependencies installable" "npm install --dry-run > /dev/null 2>&1" "required"

echo ""
echo "=========================================="
echo "📊 Summary: $CHECKS_PASSED/$TOTAL_CHECKS checks passed"

if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 All checks passed! You're ready to deploy to Heroku!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run: ./deploy-heroku.sh"
    echo "2. Or manually deploy with: git push heroku main"
    echo "3. Set environment variables in Heroku dashboard"
    echo "4. Test your deployment"
elif [ $CHECKS_PASSED -gt $((TOTAL_CHECKS * 3 / 4)) ]; then
    echo -e "${YELLOW}⚠️  Most checks passed, but please review failed items above${NC}"
    echo -e "${YELLOW}You may proceed with deployment but fix issues first${NC}"
else
    echo -e "${RED}❌ Several checks failed. Please fix issues before deploying${NC}"
    echo -e "${RED}Review the failed items above and the deployment checklist${NC}"
fi

echo ""
echo "📚 For detailed instructions, see:"
echo "- HEROKU_DEPLOYMENT_CHECKLIST.md"
echo "- HEROKU_BACKEND_DEPLOY.md"
