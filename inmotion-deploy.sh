#!/bin/bash

# 🏠 InMotion Hosting Deployment Script for Sri Lanka Explorer
# Run this script on your InMotion VPS/Dedicated Server

set -e  # Exit on any error

echo "🚀 Starting InMotion Hosting Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="tapro.podieka.com"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="tapro.podieka.com"  # Change this to your actual domain
EMAIL="info@podieka.com"  # Change this to your email

echo -e "${YELLOW}📋 Configuration:${NC}"
echo -e "App Name: $APP_NAME"
echo -e "App Directory: $APP_DIR"
echo -e "Domain: $DOMAIN"
echo ""

# Step 1: System Dependencies
echo -e "${YELLOW}🔧 Installing system dependencies...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git curl software-properties-common -y

# Step 2: Install Node.js 18
echo -e "${YELLOW}📦 Installing Node.js 18...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Step 3: Install PM2
echo -e "${YELLOW}🔄 Installing PM2...${NC}"
sudo npm install -g pm2

# Step 4: Create app directory
echo -e "${YELLOW}📁 Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Step 5: Clone repository (you'll need to replace this with your repo)
echo -e "${YELLOW}📥 Cloning repository...${NC}"
echo -e "${RED}⚠️  Please run: git clone YOUR_REPO_URL $APP_DIR${NC}"
echo -e "${RED}⚠️  Then continue with: cd $APP_DIR && ./inmotion-deploy.sh continue${NC}"

if [ "$1" != "continue" ]; then
    exit 0
fi

# Continue deployment
cd $APP_DIR

# Step 6: Install dependencies and build
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Step 7: Create environment files
echo -e "${YELLOW}⚙️  Setting up environment files...${NC}"

# Backend .env
if [ ! -f backend/.env ]; then
    cat > backend/.env << EOF
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srilanka_explorer
JWT_SECRET=$(openssl rand -base64 32)
PORT=5000
CORS_ORIGIN=https://$DOMAIN
EOF
    echo -e "${YELLOW}📝 Created backend/.env - Please update MongoDB URI!${NC}"
fi

# Frontend .env.production
if [ ! -f .env.production ]; then
    cat > .env.production << EOF
VITE_API_URL=https://$DOMAIN/api
EOF
    echo -e "${GREEN}✅ Created .env.production${NC}"
fi

# Step 8: Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend
    location / {
        root $APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Step 9: Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"

# Start backend with PM2
cd backend
pm2 start server.js --name "$APP_NAME-backend"
pm2 startup
pm2 save
cd ..

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Step 10: Setup SSL with Let's Encrypt
echo -e "${YELLOW}🔒 Setting up SSL certificate...${NC}"
sudo apt install certbot python3-certbot-nginx -y
echo -e "${YELLOW}📝 Run this command to setup SSL:${NC}"
echo -e "${GREEN}sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL${NC}"

# Step 11: Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. Update backend/.env with your MongoDB connection string"
echo -e "2. Update domain name in this script if needed"
echo -e "3. Run SSL setup: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo -e "4. Test your app at: http://$DOMAIN"
echo ""
echo -e "${YELLOW}🔧 Useful commands:${NC}"
echo -e "• Check backend status: pm2 status"
echo -e "• View backend logs: pm2 logs $APP_NAME-backend"
echo -e "• Restart backend: pm2 restart $APP_NAME-backend"
echo -e "• Check Nginx status: sudo systemctl status nginx"
echo -e "• Restart Nginx: sudo systemctl restart nginx"
