# 🚀 Quick Start: Deploy to DigitalOcean (5 Minutes)

## Fastest Way to Deploy

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Ready for DigitalOcean"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Step 2: Deploy on DigitalOcean (3 min)

1. **Go to DigitalOcean App Platform**
   - Visit: https://cloud.digitalocean.com/apps
   - Click "Create App"

2. **Connect GitHub**
   - Click "GitHub"
   - Authorize DigitalOcean
   - Select your repository
   - Choose `main` branch

3. **Configure Build** (Auto-detected, but verify)
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment: Node.js

4. **Deploy**
   - Choose Basic plan ($5/month)
   - Click "Create Resources"
   - Wait 2-3 minutes

5. **Done!** 🎉
   - Your app is live at: `https://your-app.ondigitalocean.app`
   - Admin login: `/admin/login`
   - Username: `admin`
   - Password: `mammaandmeadmin`

---

## That's It!

For more detailed instructions, see [DIGITALOCEAN_DEPLOY.md](./DIGITALOCEAN_DEPLOY.md)


