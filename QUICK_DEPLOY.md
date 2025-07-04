# 🚀 Quick Deployment Guide

## ✅ Your app is ready to deploy!

### **Fastest Way (Free Hosting)**

#### **1. Deploy Backend (5 minutes)**

1. Go to **[Render.com](https://render.com)** → Sign up with GitHub
2. Click **"New Web Service"**
3. Connect your repository: `tapro_web`
4. Configure:
   - **Name**: `sri-lanka-explorer-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srilanka_explorer
   JWT_SECRET=your_jwt_secret_key
   PORT=10000
   ```
6. Click **"Create Web Service"**
7. **Copy the deployed URL** (something like: `https://sri-lanka-explorer-api.onrender.com`)

#### **2. Setup Database (3 minutes)**

1. Go to **[MongoDB Atlas](https://cloud.mongodb.com)** → Sign up
2. Create a **free cluster**
3. **Get connection string** from "Connect" → "Connect your application"
4. **Update MONGODB_URI** in Render with your connection string
5. In MongoDB Atlas → Network Access → **Add IP Address** → Allow Access from Anywhere (`0.0.0.0/0`)

#### **3. Deploy Frontend (2 minutes)**

1. Go to **[Vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"New Project"**
3. Import your repository: `tapro_web`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (keep default)
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
   (Use the URL from step 1.7)
6. Click **"Deploy"**

#### **4. Update CORS (1 minute)**

1. Go back to **Render** → Your web service → Environment
2. Add:
   ```
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
   (Use the URL Vercel gave you)
3. **Redeploy** the service

### **🎉 That's it! Your app is live!**

---

## 📱 Test Your Deployment

1. Visit your **Vercel URL**
2. Try to **register/login**
3. Test **creating experiences**
4. Test **search functionality**

---

## 🔧 Alternative Options

### **Option 2: Netlify + Railway**

- Frontend: [Netlify](https://netlify.com) (drag & drop `dist` folder)
- Backend: [Railway](https://railway.app) (connect GitHub)

### **Option 3: All-in-One**

- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
- Deploy both frontend and backend together

---

## 💡 Pro Tips

1. **Custom Domain**: Both Vercel and Render support custom domains
2. **Environment Variables**: Never commit secrets to GitHub
3. **Database Backup**: MongoDB Atlas has automatic backups
4. **Monitoring**: Both platforms provide logs and monitoring
5. **SSL**: Automatically included with both platforms

---

## 🆘 Need Help?

### Common Issues:

- **API Connection Failed**: Check VITE_API_URL environment variable
- **CORS Error**: Verify CORS_ORIGIN matches your frontend URL
- **Database Connection**: Check MongoDB Atlas IP whitelist and connection string
- **Build Failed**: Run `npm run build` locally to debug

### Links:

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

**Your Sri Lanka Explorer app is ready to share with the world! 🌍**
