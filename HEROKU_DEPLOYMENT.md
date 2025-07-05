# Heroku Deployment Guide for Sri Lanka Explorer

This guide will help you deploy the Sri Lanka Explorer application to Heroku (backend) and Netlify/Vercel (frontend).

## 🚀 Backend Deployment (Heroku)

### Prerequisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. Git repository initialized
3. MongoDB Atlas account and cluster ready

### Step 1: Prepare the Backend

The backend is already configured for Heroku deployment with:

- ✅ `Procfile` - Tells Heroku how to run the app
- ✅ `package.json` - With Node.js version specified
- ✅ Environment variable support
- ✅ Dynamic port handling
- ✅ CORS configuration for production

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-srilanka-backend

# Add MongoDB buildpack (if needed)
heroku buildpacks:add heroku/nodejs
```

### Step 3: Set Environment Variables

Set these in Heroku Dashboard → Settings → Config Vars:

```bash
# Or use CLI
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/tapro"
heroku config:set JWT_SECRET="your-super-secret-jwt-key"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-frontend-domain.netlify.app"
heroku config:set CORS_ORIGIN="https://your-frontend-domain.netlify.app"
```

### Step 4: Deploy Backend

```bash
# Navigate to backend directory
cd backend

# Initialize git (if not done)
git init
git add .
git commit -m "Initial backend commit"

# Add Heroku remote
heroku git:remote -a your-srilanka-backend

# Deploy
git push heroku main
```

### Step 5: Verify Backend Deployment

```bash
# Check if app is running
heroku logs --tail

# Test the API
curl https://your-srilanka-backend.herokuapp.com/api/health
```

## 🌐 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

The frontend is configured with:

- ✅ Build optimization in `vite.config.js`
- ✅ Environment variable support
- ✅ Production build scripts

### Step 2: Update API URL

1. Update `.env.production`:

```env
VITE_API_URL=https://your-srilanka-backend.herokuapp.com/api
```

2. Update `src/context/SEOContext.jsx`:

```javascript
const baseUrl = "https://your-frontend-domain.netlify.app";
```

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Option B: Git Integration

1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Step 4: Configure Netlify

Create `netlify.toml` in root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

## 🔧 Environment Variables Setup

### Backend (Heroku Config Vars)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
CORS_ORIGIN=https://your-app.netlify.app
PORT=5000
```

### Frontend (Netlify Environment Variables)

```
VITE_API_URL=https://your-backend.herokuapp.com/api
```

## 📋 Pre-Deployment Checklist

### Backend ✅

- [ ] MongoDB Atlas cluster created and accessible
- [ ] Environment variables configured in Heroku
- [ ] CORS origins updated for production domains
- [ ] File upload directory configured
- [ ] Dependencies installed (`bcryptjs`, `jsonwebtoken`, etc.)

### Frontend ✅

- [ ] API URL updated for production
- [ ] Build process tested locally (`npm run build`)
- [ ] SEO URLs updated to production domain
- [ ] Environment variables set in Netlify
- [ ] Routing configured for SPA

## 🚨 Common Issues & Solutions

### Backend Issues

#### 1. App Crashes on Startup

```bash
# Check logs
heroku logs --tail

# Common fix: ensure all dependencies are in package.json
npm install --save bcryptjs jsonwebtoken
```

#### 2. Database Connection Failed

- Verify MongoDB URI in Heroku config vars
- Ensure MongoDB cluster allows connections from anywhere (0.0.0.0/0)

#### 3. CORS Errors

- Update CORS origins in `server.js`
- Set FRONTEND_URL environment variable

### Frontend Issues

#### 1. API Calls Fail

- Check VITE_API_URL environment variable
- Verify backend is deployed and accessible

#### 2. Routing Issues (404 on refresh)

- Ensure `_redirects` file or `netlify.toml` is configured
- SPA routing must redirect all routes to `index.html`

#### 3. Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🔐 Security Considerations

1. **JWT Secret**: Use a strong, random secret key
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Restrict origins to your actual domains
4. **HTTPS**: Both frontend and backend should use HTTPS
5. **File Uploads**: Consider file size limits and validation

## 📊 Monitoring & Maintenance

### Heroku Monitoring

```bash
# View app info
heroku info

# Check dyno usage
heroku ps

# View logs
heroku logs --tail

# Restart app
heroku restart
```

### Performance Optimization

1. **Heroku**: Consider upgrading from free tier for better performance
2. **MongoDB**: Use connection pooling and indexes
3. **Frontend**: Enable gzip compression in Netlify
4. **Images**: Optimize image sizes and formats

## 🎯 Production URLs

After deployment, update these in your code:

- **Backend API**: `https://your-app-name.herokuapp.com`
- **Frontend**: `https://your-app-name.netlify.app`
- **Admin Panel**: Update in navigation components

## 📈 Post-Deployment Tasks

1. **Test All Features**:

   - User registration/login
   - Experience creation with image uploads
   - Province/district/city navigation
   - Search functionality

2. **SEO Setup**:

   - Submit sitemap to Google Search Console
   - Update Google Analytics
   - Verify social media sharing

3. **Performance Testing**:
   - Run Lighthouse audit
   - Test mobile responsiveness
   - Verify Core Web Vitals

---

**Note**: Replace placeholder URLs and credentials with your actual deployment URLs and secure credentials.
