# 🏠 InMotion Hosting Deployment Guide

## ✅ Deploy Your Sri Lanka Explorer App to InMotion Hosting

InMotion Hosting offers different hosting plans. Choose the option that matches your plan:

---

## 🚀 Option 1: VPS/Dedicated Server (Recommended)

### **Step 1: Server Setup (10 minutes)**

1. **Access your server** via SSH:

   ```bash
   ssh username@your-server-ip
   ```

2. **Update the system**:

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Node.js and npm**:

   ```bash
   # Install Node.js 18+ (recommended)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

4. **Install PM2 (Process Manager)**:

   ```bash
   sudo npm install -g pm2
   ```

5. **Install Git**:
   ```bash
   sudo apt install git -y
   ```

### **Step 2: Deploy Your Application (15 minutes)**

1. **Clone your repository**:

   ```bash
   cd /var/www
   sudo git clone https://github.com/yourusername/tapro_web.git
   sudo chown -R $USER:$USER tapro_web
   cd tapro_web
   ```

2. **Setup Backend**:

   ```bash
   cd backend
   npm install

   # Create production environment file
   nano .env
   ```

   Add these environment variables:

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srilanka_explorer
   JWT_SECRET=your_super_secure_jwt_secret_key
   PORT=5000
   CORS_ORIGIN=https://yourdomain.com
   ```

3. **Setup Frontend**:

   ```bash
   cd ..
   npm install

   # Create frontend environment file
   nano .env.production
   ```

   Add:

   ```
   VITE_API_URL=https://yourdomain.com/api
   ```

4. **Build Frontend**:
   ```bash
   npm run build
   ```

### **Step 3: Configure Nginx (Web Server)**

1. **Install Nginx**:

   ```bash
   sudo apt install nginx -y
   ```

2. **Create Nginx configuration**:

   ```bash
   sudo nano /etc/nginx/sites-available/srilanka-explorer
   ```

   Add this configuration:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Serve frontend static files
       location / {
           root /var/www/tapro_web/dist;
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to backend
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

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/srilanka-explorer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### **Step 4: Start Your Application**

1. **Start backend with PM2**:

   ```bash
   cd /var/www/tapro_web/backend
   pm2 start server.js --name "srilanka-api"
   pm2 save
   pm2 startup
   ```

2. **Setup SSL (Let's Encrypt)**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### **Step 5: Setup MongoDB**

Use **MongoDB Atlas** (recommended) or install MongoDB on your server:

**Option A: MongoDB Atlas (Easier)**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Update `.env` file with the connection string

**Option B: Local MongoDB (Advanced)**

```bash
# Install MongoDB
sudo apt install mongodb -y
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

---

## 🌐 Option 2: Shared Hosting (Limited)

InMotion's shared hosting has limitations for Node.js apps. You'll need to use their VPS or dedicated hosting for full functionality.

### **Alternative for Shared Hosting:**

1. **Static Frontend Only**:

   - Upload your `dist/` folder contents to `public_html/`
   - Use external API hosting (Render, Railway, etc.)

2. **Setup**:

   ```bash
   # Build your app locally
   npm run build

   # Upload dist/ contents via FTP/cPanel File Manager to:
   # public_html/
   ```

3. **Update API URL**:
   ```bash
   # Set environment variable for external API
   VITE_API_URL=https://your-backend-on-render.onrender.com
   ```

---

## 🔄 Deployment Script for InMotion VPS

Create an automated deployment script:

```bash
#!/bin/bash
# deploy-to-inmotion.sh

echo "🚀 Deploying to InMotion Hosting..."

# Pull latest changes
git pull origin main

# Install/update dependencies
npm install
cd backend && npm install && cd ..

# Build frontend
npm run build

# Restart backend
pm2 restart srilanka-api

# Reload nginx
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌐 Visit: https://yourdomain.com"
```

---

## 🛠️ InMotion Hosting Control Panel Setup

### **Domain Configuration:**

1. Log into **InMotion cPanel**
2. Go to **Subdomains** or **Addon Domains**
3. Point your domain to your VPS IP
4. Update DNS records as needed

### **Database Setup (if using cPanel):**

1. Go to **MySQL Databases**
2. Create database: `srilanka_explorer`
3. Create user and assign privileges
4. Update connection string in `.env`

---

## 📊 Monitoring & Maintenance

### **Check Application Status:**

```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs srilanka-api

# Check Nginx status
sudo systemctl status nginx

# Monitor disk space
df -h
```

### **Regular Maintenance:**

```bash
# Update dependencies
npm update

# Restart services
pm2 restart all
sudo systemctl restart nginx

# Update system
sudo apt update && sudo apt upgrade
```

---

## 💰 InMotion Hosting Plan Recommendations

### **For Development/Testing:**

- **VPS-1000HA-S**: $17.99/month
- 4GB RAM, 75GB SSD
- Perfect for small to medium apps

### **For Production:**

- **VPS-2000HA-S**: $27.99/month
- 6GB RAM, 150GB SSD
- Better performance and reliability

### **Features Included:**

- ✅ Free SSL certificates
- ✅ Daily backups
- ✅ 24/7 support
- ✅ SSH access
- ✅ Full root access

---

## 🆘 Troubleshooting

### **Common Issues:**

1. **Permission Denied**:

   ```bash
   sudo chown -R $USER:$USER /var/www/tapro_web
   ```

2. **Port Already in Use**:

   ```bash
   sudo lsof -i :5000
   sudo kill -9 PID
   ```

3. **Nginx Configuration Error**:

   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **Database Connection Failed**:
   - Check MongoDB Atlas IP whitelist
   - Verify connection string in `.env`

### **Support:**

- **InMotion Support**: 24/7 live chat and phone
- **Documentation**: https://www.inmotionhosting.com/support/

---

## 🎉 Your App is Live!

After deployment, your Sri Lanka Explorer app will be available at:

- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/api

**Features Working:**

- ✅ User authentication
- ✅ Experience creation and management
- ✅ Search with suggestions
- ✅ Pagination
- ✅ Image galleries
- ✅ Responsive design

**Ready to explore Sri Lanka! 🌴**
