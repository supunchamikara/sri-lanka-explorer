# 🏠 InMotion Hosting - Quick Deploy Guide

## ⚡ **One-Click Deployment for InMotion VPS**

### **Prerequisites**

- InMotion VPS or Dedicated Server
- Domain name pointed to your server
- SSH access to your server

### **Step 1: Upload Your Code**

```bash
# On your local machine
cd /Users/supun/Downloads/Supun_WF/tapro_web
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (or your preferred git service)
git remote add origin https://github.com/yourusername/sri-lanka-explorer.git
git push -u origin main
```

### **Step 2: Deploy on InMotion Server**

```bash
# SSH into your InMotion server
ssh username@your-server-ip

# Run the deployment script
curl -fsSL https://raw.githubusercontent.com/yourusername/sri-lanka-explorer/main/inmotion-deploy.sh | bash
```

### **Step 3: Configure Your App**

1. **Update MongoDB connection** in `backend/.env`
2. **Update domain name** in deployment script
3. **Setup SSL certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### **Step 4: Test Your Deployment**

Visit: `https://yourdomain.com`

---

## 🎯 **Manual Deployment Steps**

If you prefer manual deployment, follow these steps:

### **1. Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install nginx git -y
```

### **2. Deploy Application**

```bash
# Clone your repository
cd /var/www
sudo git clone https://github.com/yourusername/sri-lanka-explorer.git
sudo chown -R $USER:$USER sri-lanka-explorer
cd sri-lanka-explorer

# Install and build frontend
npm install
npm run build

# Install backend dependencies
cd backend
npm install
cd ..
```

### **3. Environment Configuration**

```bash
# Backend environment
cat > backend/.env << EOF
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srilanka_explorer
JWT_SECRET=your_super_secure_jwt_secret_key
PORT=5000
CORS_ORIGIN=https://yourdomain.com
EOF

# Frontend environment
cat > .env.production << EOF
VITE_API_URL=https://yourdomain.com/api
EOF
```

### **4. Nginx Configuration**

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/sri-lanka-explorer
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/sri-lanka-explorer/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **5. Start Services**

```bash
# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/sri-lanka-explorer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start backend with PM2
cd backend
pm2 start server.js --name "sri-lanka-explorer-backend"
pm2 startup
pm2 save
```

### **6. Setup SSL**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **App not loading:**

   - Check PM2 status: `pm2 status`
   - Check logs: `pm2 logs sri-lanka-explorer-backend`

2. **API not working:**

   - Verify backend is running on port 5000
   - Check MongoDB connection in `.env`

3. **SSL issues:**
   - Ensure domain DNS is pointing to server
   - Check firewall: `sudo ufw status`

### **Useful Commands:**

```bash
# PM2 Management
pm2 status
pm2 restart sri-lanka-explorer-backend
pm2 logs sri-lanka-explorer-backend

# Nginx Management
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t

# SSL Renewal
sudo certbot renew
```

---

## 📞 **Support**

For InMotion Hosting specific issues:

- Contact InMotion Support: 1-888-321-HOST
- Visit: https://www.inmotionhosting.com/support/

## 🎉 **That's It!**

Your Sri Lanka Explorer app should now be live at `https://yourdomain.com`!

**Features Available:**

- ✅ User Authentication
- ✅ Province/District/City Navigation
- ✅ Travel Experiences
- ✅ Image Galleries
- ✅ Search Functionality
- ✅ Responsive Design
- ✅ SSL Security
