# Deployment Guide for M💗mma & Me E-commerce

This guide will help you deploy your Next.js e-commerce application to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest for Next.js)

Vercel is the creators of Next.js and offers the best integration.

#### Steps:
1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Your site will be live in ~2 minutes!**

#### Environment Variables (if needed):
- No environment variables required for basic setup
- All data is stored in localStorage (client-side)

---

### Option 2: Netlify

#### Steps:
1. **Push code to GitHub** (same as above)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

3. **Configure Next.js on Netlify**
   - Install Netlify Next.js plugin (auto-detected)
   - Or add `netlify.toml` (see below)

---

### Option 3: Railway

#### Steps:
1. **Push code to GitHub**

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Next.js
   - Add build command: `npm run build`
   - Add start command: `npm start`

---

### Option 4: Render

#### Steps:
1. **Push code to GitHub**

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New" → "Web Service"
   - Connect your repository
   - Settings:
     - Build Command: `npm run build`
     - Start Command: `npm start`
   - Click "Create Web Service"

---

## 📋 Pre-Deployment Checklist

### ✅ Before Deploying:

1. **Test Production Build Locally**
   ```bash
   npm run build
   npm start
   ```
   Visit `http://localhost:3000` to test

2. **Update Next.js Config** (if needed)
   - Security headers are commented out in `next.config.js`
   - Uncomment for production if you want extra security

3. **Environment Variables**
   - Currently, no environment variables are required
   - All data persists in browser localStorage

4. **Admin Credentials**
   - Username: `admin`
   - Password: `mammaandmeadmin`
   - Keep these secure!

---

## 🔧 Configuration Files

### Vercel (Already Created)
- `vercel.json` - Vercel deployment config

### Netlify (Optional)
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Docker (Optional)
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 🌐 Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

---

## 📊 Post-Deployment

### What Works:
- ✅ All pages and routes
- ✅ Product catalog
- ✅ Shopping cart (localStorage)
- ✅ Admin panel
- ✅ Order management
- ✅ Customer management
- ✅ Settings management

### Important Notes:
- **Data Storage**: All data (products, orders, customers) is stored in browser localStorage
- **Multi-user**: Each user has their own localStorage, so data isn't shared between users
- **Admin Panel**: Accessible at `/admin/login`
- **No Backend**: This is a frontend-only application

---

## 🐛 Troubleshooting

### Build Fails:
- Make sure all dependencies are in `package.json`
- Run `npm install` before building
- Check Node.js version (should be 18+)

### Runtime Errors:
- Check browser console for errors
- Verify all environment variables are set
- Check hosting platform logs

### Images Not Loading:
- Verify image domains in `next.config.js`
- Check CORS settings if using external images

---

## 📞 Support

For deployment issues:
- Check hosting platform documentation
- Review Next.js deployment docs: https://nextjs.org/docs/deployment
- Check platform-specific Next.js guides

---

## 🎉 You're Ready!

Your app is ready to deploy. Choose your preferred platform and follow the steps above!

**Recommended**: Start with Vercel for the easiest Next.js deployment experience.



