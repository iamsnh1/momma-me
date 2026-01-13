# 🚀 Deploy to DigitalOcean - Step by Step

## ⚠️ Important: I Cannot Access Your DigitalOcean Account

I cannot directly log into DigitalOcean or click buttons for you. However, I've prepared everything you need. Follow these steps:

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Verify GitHub Repository
Make sure your code is pushed to GitHub:

```bash
# Check if you have a remote
git remote -v

# If not, add your GitHub repo
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Step 2: Go to DigitalOcean App Platform
1. Open your browser
2. Go to: **https://cloud.digitalocean.com/apps**
3. Log in to your DigitalOcean account
   - If you don't have an account, sign up at: https://www.digitalocean.com

### Step 3: Create New App
1. Click the **"Create App"** button (usually top right)
2. You'll see options to connect a source

### Step 4: Connect GitHub
1. Click **"GitHub"** as your source
2. If first time:
   - Click "Authorize DigitalOcean"
   - Grant access to your repositories
   - You may need to enter your GitHub password
3. Select your repository from the list
4. Choose branch: **`main`** (or `master` if that's your default)

### Step 5: Configure Build Settings
DigitalOcean should auto-detect Next.js, but verify:

**Build Settings:**
- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **Environment**: Node.js
- **Node Version**: 18.x or 20.x (select latest available)
- **Source Directory**: `/` (root)

**Environment Variables** (Click "Edit" if needed):
- `NODE_ENV` = `production`
- `PORT` = `3000`

(These are optional - DigitalOcean can auto-detect)

### Step 6: Choose Plan
- Select **Basic-XXS** ($5/month) for testing
- Or **Basic-XS** ($12/month) for better performance
- Click **"Next"** or **"Continue"**

### Step 7: Review and Deploy
1. Review your configuration
2. Give your app a name (e.g., "momma-me" or "momma-and-me")
3. Choose a region (closest to your users)
4. Click **"Create Resources"** or **"Deploy"**

### Step 8: Wait for Deployment
- DigitalOcean will:
  1. Clone your repository
  2. Install dependencies (`npm install`)
  3. Build your app (`npm run build`)
  4. Start your app (`npm start`)
- This takes **2-5 minutes**
- You'll see build logs in real-time

### Step 9: Access Your App
Once deployment completes:
- Your app URL will be: `https://your-app-name.ondigitalocean.app`
- Click the URL or "Live App" button
- Test your app!

---

## 🔍 Troubleshooting

### If Build Fails:
1. Check build logs in DigitalOcean dashboard
2. Common issues:
   - Wrong Node.js version → Use 18.x or 20.x
   - Missing dependencies → Check `package.json`
   - Build errors → Check logs

### If App Doesn't Start:
1. Check runtime logs
2. Verify `npm start` works locally
3. Check PORT environment variable

### If GitHub Connection Fails:
1. Re-authorize DigitalOcean in GitHub settings
2. Check repository is public or you've granted access
3. Try disconnecting and reconnecting

---

## ✅ After Deployment Checklist

- [ ] App loads at the provided URL
- [ ] Homepage displays correctly
- [ ] Products page works
- [ ] Admin login works: `/admin/login`
  - Username: `admin`
  - Password: `mammaandmeadmin`
- [ ] Cart functionality works
- [ ] Checkout process works

---

## 🎯 Quick Reference

**Your Deployment Settings:**
```
Repository: Your GitHub repo
Branch: main
Build: npm run build
Start: npm start
Node: 18.x or 20.x
Plan: Basic-XXS ($5/month)
```

**Admin Credentials:**
```
URL: /admin/login
Username: admin
Password: mammaandmeadmin
```

---

## 💡 Pro Tips

1. **Auto-Deploy**: DigitalOcean will auto-deploy when you push to GitHub
2. **Custom Domain**: Add your domain in App Settings → Domains
3. **Environment Variables**: Add any needed vars in App Settings → App-Level Environment Variables
4. **Monitoring**: Check App Platform → Insights for performance metrics

---

## 🆘 Need Help?

If you encounter issues:
1. Check DigitalOcean build logs
2. Check runtime logs
3. Verify your code builds locally: `npm run build`
4. Check DigitalOcean status page

---

**Everything is ready! Just follow the steps above! 🚀**


