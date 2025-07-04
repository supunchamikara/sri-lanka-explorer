# Sri Lanka Explorer - Deployment Guide

## 🚀 Deploy to Vercel (Frontend) + Render (Backend)

### **Step 1: Prepare for Deployment**

1. **Create production build**:

   ```bash
   npm run build
   ```

2. **Test the build locally**:
   ```bash
   npm run preview
   ```

### **Step 2: Deploy Backend to Render**

1. **Create a Render account** at https://render.com
2. **Connect your GitHub repository**
3. **Create a new Web Service**:

   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Add Environment Variables** in Render:

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=10000
   ```

5. **MongoDB Setup**:
   - Use MongoDB Atlas (free tier): https://cloud.mongodb.com
   - Create a cluster and get connection string
   - Whitelist Render's IP addresses (0.0.0.0/0 for simplicity)

### **Step 3: Deploy Frontend to Vercel**

1. **Create a Vercel account** at https://vercel.com
2. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

3. **Login to Vercel**:

   ```bash
   vercel login
   ```

4. **Deploy**:

   ```bash
   vercel --prod
   ```

5. **Configure Environment Variables** in Vercel dashboard:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

### **Step 4: Update API Configuration**

Update your frontend API configuration to use the production backend URL.

---

## 🌐 Alternative Options

### **Option 2: Netlify (Frontend) + Railway (Backend)**

1. **Deploy to Railway**:

   - Connect GitHub repo
   - Deploy backend folder
   - Add environment variables

2. **Deploy to Netlify**:
   - Drag and drop `dist` folder
   - Or connect GitHub for automatic deployments

### **Option 3: DigitalOcean App Platform (Full Stack)**

- Deploy both frontend and backend together
- More expensive but simpler configuration

### **Option 4: AWS (Advanced)**

- Use AWS Amplify for frontend
- Use AWS EC2 or Lambda for backend
- Use AWS DocumentDB or MongoDB Atlas

---

## 🔧 Production Optimizations

### **1. Backend Optimizations**

Add to `backend/server.js`:

```javascript
// Production optimizations
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(compression());
}

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}
```

### **2. Environment Variables Setup**

Create `.env.production` in backend:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srilanka_explorer
JWT_SECRET=your_super_secure_jwt_secret_key_here
PORT=10000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### **3. Frontend Production Configuration**

Create `vite.config.js` optimizations:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
```

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database setup (MongoDB Atlas)
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] CORS configured for production domains
- [ ] Security headers added
- [ ] Error handling implemented
- [ ] Database indexes created
- [ ] Backup strategy planned

---

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure backend CORS is configured for production domain
2. **API Connection**: Verify VITE_API_URL is correct
3. **Database Connection**: Check MongoDB connection string and IP whitelist
4. **Build Errors**: Ensure all dependencies are in package.json
5. **Environment Variables**: Double-check all required env vars are set

---

## 💰 Cost Estimates

### **Free Tier (Recommended)**:

- **Vercel**: Free (hobby plan)
- **Render**: Free tier available
- **MongoDB Atlas**: Free tier (512MB)
- **Total**: $0/month

### **Paid Tier**:

- **Vercel Pro**: $20/month
- **Render**: $7/month (starter)
- **MongoDB Atlas**: $9/month (shared cluster)
- **Total**: ~$36/month

Choose the option that best fits your needs and budget!
