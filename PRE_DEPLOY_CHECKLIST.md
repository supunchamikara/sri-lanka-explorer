# ✅ Pre-Deployment Checklist for InMotion Hosting

## 🚀 **Before You Deploy**

### **1. Code Preparation**

- [ ] All features tested locally
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Backend starts without errors (`cd backend && npm start`)
- [ ] Git repository is up to date

### **2. Environment Variables**

- [ ] MongoDB Atlas cluster is set up (or plan to use local MongoDB)
- [ ] JWT secret key is generated
- [ ] Domain name is ready and DNS is configured

### **3. InMotion Hosting Account**

- [ ] VPS or Dedicated Server is provisioned
- [ ] SSH access is available
- [ ] Root/sudo access is confirmed
- [ ] Firewall allows HTTP (80) and HTTPS (443)

### **4. Domain Configuration**

- [ ] Domain is pointed to your InMotion server IP
- [ ] DNS A record: `yourdomain.com` → `your-server-ip`
- [ ] DNS A record: `www.yourdomain.com` → `your-server-ip`
- [ ] DNS propagation is complete (check with `dig yourdomain.com`)

### **5. MongoDB Setup**

Choose one option:

**Option A: MongoDB Atlas (Recommended)**

- [ ] Free cluster created at [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0 for now)
- [ ] Connection string obtained

**Option B: Local MongoDB**

- [ ] Plan to install MongoDB on your server
- [ ] Understand local backup requirements

---

## 🔧 **Quick Test Commands**

Before deploying, run these locally:

```bash
# Test frontend build
npm run build
ls -la dist/  # Should show built files

# Test backend
cd backend
npm install
npm start  # Should start on port 5000

# Test frontend dev mode
npm run dev  # Should start on port 5173
```

---

## 📋 **Deployment Options**

### **Option 1: Automated Script (Recommended)**

1. Push your code to GitHub
2. SSH into your InMotion server
3. Run the deployment script:
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/yourusername/sri-lanka-explorer/main/inmotion-deploy.sh)
   ```

### **Option 2: Manual Deployment**

Follow the step-by-step guide in `INMOTION_QUICK_DEPLOY.md`

---

## 🎯 **Post-Deployment Verification**

After deployment, verify these:

### **Frontend Checks**

- [ ] Website loads at `https://yourdomain.com`
- [ ] All pages navigate correctly (Home, Provinces, Districts, Cities)
- [ ] Images and styles load properly
- [ ] Search functionality works
- [ ] Responsive design works on mobile

### **Backend Checks**

- [ ] API endpoints respond: `https://yourdomain.com/api/test`
- [ ] User registration works
- [ ] User login works
- [ ] Experience creation works
- [ ] Image uploads work

### **Security Checks**

- [ ] SSL certificate is installed and working
- [ ] HTTP redirects to HTTPS
- [ ] API CORS is configured correctly
- [ ] Environment variables are secure

---

## 🚨 **Common Issues & Solutions**

### **Build Fails**

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Backend Won't Start**

```bash
# Check logs
pm2 logs sri-lanka-explorer-backend

# Common fixes
# 1. Check MongoDB connection string
# 2. Verify environment variables
# 3. Check port availability
```

### **Domain Not Loading**

```bash
# Check DNS propagation
dig yourdomain.com

# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t
```

### **SSL Issues**

```bash
# Check certificate status
sudo certbot certificates

# Renew if needed
sudo certbot renew
```

---

## 📞 **Support Resources**

### **InMotion Hosting Support**

- Phone: 1-888-321-HOST
- Live Chat: Available 24/7
- Knowledge Base: https://www.inmotionhosting.com/support/

### **Technical Documentation**

- Node.js on InMotion: Check their knowledge base
- SSL Setup: Included in most VPS plans
- MongoDB: Use Atlas for easier management

---

## 🎉 **Ready to Deploy?**

If you've checked all items above, you're ready to deploy your Sri Lanka Explorer app to InMotion Hosting!

Choose your deployment method and follow the instructions in `INMOTION_QUICK_DEPLOY.md`.

**Good luck with your deployment! 🚀**
