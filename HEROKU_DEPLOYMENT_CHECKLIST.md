# 🚀 Heroku Deployment Checklist for Sri Lanka Explorer

## ✅ Pre-Deployment Checklist

### 1. Environment Setup

- [ ] Heroku CLI installed and logged in
- [ ] MongoDB Atlas database created and accessible
- [ ] Git repository initialized and committed
- [ ] All sensitive data removed from code (no hardcoded passwords/secrets)

### 2. Backend Configuration

- [ ] `Procfile` exists in root directory
- [ ] `package.json` has engines specified (Node.js version)
- [ ] Environment variables ready for Heroku Config Vars
- [ ] CORS configured for production frontend URL
- [ ] MongoDB connection string ready
- [ ] JWT secret generated

### 3. File Structure Verification

```
tapro_web/
├── Procfile                     # ✅ Created
├── package.json                 # ✅ Updated with engines
├── backend/
│   ├── server.js               # ✅ Ready
│   ├── package.json            # ✅ Ready
│   └── .env.example            # ✅ Ready
├── src/                        # Frontend (deploy separately)
└── deploy-heroku.sh            # ✅ Deployment script
```

## 🚀 Deployment Steps

### Step 1: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create app (replace with your app name)
heroku create tapro-web-backend

# Or use the deployment script
./deploy-heroku.sh
```

### Step 2: Set Environment Variables

In Heroku Dashboard (Settings > Config Vars) or via CLI:

```bash
# Required Variables
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/tapro?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your-super-secret-jwt-key-here"
heroku config:set NODE_ENV="production"

# CORS Configuration (update with your frontend domain)
heroku config:set FRONTEND_URL="https://your-frontend.netlify.app"
heroku config:set CORS_ORIGIN="https://your-frontend.netlify.app"
```

### Step 3: Deploy

```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Step 4: Verify Deployment

```bash
# Check logs
heroku logs --tail

# Test endpoints
curl https://your-app-name.herokuapp.com/api/health
curl https://your-app-name.herokuapp.com/api/test-connection
```

## 🌐 Frontend Configuration

After backend deployment, update your frontend:

1. **Update API URL in `.env.production`:**

   ```
   VITE_API_URL=https://your-app-name.herokuapp.com
   ```

2. **Deploy frontend to Netlify/Vercel**

3. **Update CORS settings in Heroku:**
   ```bash
   heroku config:set FRONTEND_URL="https://your-frontend-domain.netlify.app"
   heroku config:set CORS_ORIGIN="https://your-frontend-domain.netlify.app"
   ```

## 📝 Important Notes

### File Storage Warning

⚠️ **Heroku uses ephemeral storage!** Uploaded files in `/uploads/experiences/` will be lost when dynos restart.

**For production, consider:**

- AWS S3 for file storage
- Cloudinary for image hosting
- Or implement cleanup for temporary files

### Environment Variables

- Never commit `.env` files to Git
- Always use Heroku Config Vars for sensitive data
- MongoDB Atlas should allow connections from anywhere (0.0.0.0/0)

### Performance Tips

- Use MongoDB Atlas in the same region as your Heroku app
- Enable database connection pooling
- Consider using Redis for session storage
- Monitor dyno usage and scale as needed

## 🔍 Testing Your Deployment

1. **Health Check:**

   ```
   https://your-app-name.herokuapp.com/api/health
   ```

2. **Database Connection:**

   ```
   https://your-app-name.herokuapp.com/api/test-connection
   ```

3. **CORS Test:**
   Open browser console on your frontend and check for CORS errors

4. **File Upload Test:**
   Try uploading an image through your frontend

## 🛠️ Troubleshooting

### Common Issues:

1. **App crashes on startup:**

   - Check `heroku logs --tail`
   - Verify all environment variables are set
   - Ensure MongoDB URI is correct

2. **CORS errors:**

   - Update CORS_ORIGIN config var
   - Check frontend API_URL configuration

3. **Database connection fails:**

   - Verify MongoDB Atlas whitelist settings
   - Check MONGODB_URI format
   - Ensure database user has proper permissions

4. **File uploads not working:**
   - Remember: Heroku has ephemeral storage
   - Files will be lost on dyno restart
   - Consider external storage solutions

## 📊 Monitoring

- **Heroku Dashboard:** Monitor dyno performance
- **MongoDB Atlas:** Monitor database performance
- **Application Logs:** `heroku logs --tail`
- **Error Tracking:** Consider services like Sentry

## 🚀 Ready to Deploy?

Run the deployment script:

```bash
./deploy-heroku.sh
```

Or follow the manual steps above. Good luck! 🍀
