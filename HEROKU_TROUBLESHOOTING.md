# 🚨 Heroku Deployment Troubleshooting Guide

## Your App Status: DEPLOYED but with Application Error

**App URL:** https://tapro-3c3bc3ed4b88.herokuapp.com/

## Immediate Action Required

### 1. Install Heroku CLI (Required for debugging)

**On macOS:**

```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Heroku CLI
brew tap heroku/brew && brew install heroku
```

**Alternative installation:**

```bash
# Direct download
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Check Application Logs (After installing Heroku CLI)

```bash
heroku login
heroku logs --tail --app tapro-3c3bc3ed4b88
```

### 3. Verify Environment Variables

```bash
heroku config --app tapro-3c3bc3ed4b88
```

**Required Environment Variables:**

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your frontend domain (when deployed)

### 4. Set Missing Environment Variables

```bash
# Example commands (replace with your actual values)
heroku config:set MONGODB_URI="mongodb+srv://tapro:password@cluster0.9l8fn6a.mongodb.net/tapro?retryWrites=true&w=majority" --app tapro-3c3bc3ed4b88

heroku config:set JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random" --app tapro-3c3bc3ed4b88

heroku config:set NODE_ENV="production" --app tapro-3c3bc3ed4b88

# For CORS (update when you deploy frontend)
heroku config:set FRONTEND_URL="https://your-frontend-domain.netlify.app" --app tapro-3c3bc3ed4b88
```

## Common Issues and Solutions

### Issue 1: Environment Variables Missing

**Symptom:** App crashes on startup
**Solution:** Set all required environment variables above

### Issue 2: MongoDB Connection Failed

**Symptom:** Database connection errors in logs
**Solutions:**

- Verify MongoDB URI is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check database user permissions

### Issue 3: Procfile Not Found

**Symptom:** "no web processes running"
**Solution:** Already fixed in your current deployment

### Issue 4: Module Not Found Errors

**Symptom:** Cannot find module errors
**Solution:** Redeploy to ensure all dependencies are installed

```bash
git commit --allow-empty -m "Trigger rebuild"
git push heroku main
```

## Quick Diagnosis Commands

After installing Heroku CLI:

```bash
# 1. Check app status
heroku ps --app tapro-3c3bc3ed4b88

# 2. Check configuration
heroku config --app tapro-3c3bc3ed4b88

# 3. View recent logs
heroku logs --tail --app tapro-3c3bc3ed4b88

# 4. Restart the app
heroku restart --app tapro-3c3bc3ed4b88

# 5. Check buildpack
heroku buildpacks --app tapro-3c3bc3ed4b88
```

## Testing Your API

Once fixed, test these endpoints:

1. **Health Check:**

   ```
   curl https://tapro-3c3bc3ed4b88.herokuapp.com/api/health
   ```

2. **Database Connection:**

   ```
   curl https://tapro-3c3bc3ed4b88.herokuapp.com/api/test-connection
   ```

3. **Browser Test:**
   Open https://tapro-3c3bc3ed4b88.herokuapp.com/api/health in your browser

## Expected Response (When Working)

```json
{
  "status": "OK",
  "message": "Sri Lanka Explorer API is running",
  "timestamp": "2025-07-06T...",
  "database": "Connected"
}
```

## Next Steps After Fixing

1. **Deploy Frontend:** Deploy your React app to Netlify/Vercel
2. **Update CORS:** Set FRONTEND_URL to your frontend domain
3. **Test Integration:** Verify frontend can communicate with backend
4. **Monitor:** Keep an eye on Heroku logs for any issues

## Need Help?

If you're still experiencing issues after following this guide:

1. Run `heroku logs --tail --app tapro-3c3bc3ed4b88` and check for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your MongoDB Atlas database is accessible
4. Check if your database user has the correct permissions

The most likely issue is missing environment variables, especially `MONGODB_URI` and `JWT_SECRET`.
