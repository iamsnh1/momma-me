# Deploy to DigitalOcean - Step by Step Guide

This guide will help you deploy your Next.js e-commerce app to DigitalOcean.

## 🚀 Option 1: DigitalOcean App Platform (Recommended - Easiest)

App Platform is the easiest way to deploy Next.js apps on DigitalOcean, similar to Vercel.

### Prerequisites:
1. A DigitalOcean account ([Sign up here](https://www.digitalocean.com))
2. Your code pushed to GitHub

### Steps:

#### Step 1: Push Code to GitHub
```bash
# If you haven't already
git init
git add .
git commit -m "Ready for DigitalOcean deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### Step 2: Create App on DigitalOcean
1. **Login to DigitalOcean**
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Sign in or create an account

2. **Navigate to App Platform**
   - Click "Create" in the top right
   - Select "Apps"
   - Or go directly to [App Platform](https://cloud.digitalocean.com/apps)

3. **Connect GitHub Repository**
   - Click "GitHub" to connect your account
   - Authorize DigitalOcean to access your repositories
   - Select your repository
   - Choose the branch (usually `main`)

4. **Configure Build Settings**
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Source Directory**: `/` (root)
   - **Environment**: Node.js
   - **Node Version**: 18.x or 20.x

5. **Configure Environment Variables** (Optional)
   - Currently, no environment variables are required
   - All data uses localStorage

6. **Review and Deploy**
   - Review your settings
   - Choose a plan (Basic plan starts at $5/month)
   - Click "Create Resources"
   - DigitalOcean will build and deploy your app

#### Step 3: Access Your App
- Once deployed, you'll get a URL like: `https://your-app-name.ondigitalocean.app`
- Your app will be live!

---

## 🖥️ Option 2: DigitalOcean Droplet (VPS - More Control)

If you prefer more control or want to use a Droplet (VPS), follow these steps:

### Prerequisites:
1. A DigitalOcean account
2. Basic knowledge of Linux commands
3. SSH access

### Steps:

#### Step 1: Create a Droplet
1. Go to DigitalOcean Dashboard
2. Click "Create" → "Droplets"
3. Choose:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month minimum)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) or password
4. Click "Create Droplet"

#### Step 2: Connect to Your Droplet
```bash
ssh root@your-droplet-ip
```

#### Step 3: Install Node.js and npm
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Step 4: Install PM2 (Process Manager)
```bash
npm install -g pm2
```

#### Step 5: Clone Your Repository
```bash
# Install Git if not already installed
apt install -y git

# Clone your repository
cd /var/www
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install
```

#### Step 6: Build Your Application
```bash
npm run build
```

#### Step 7: Start with PM2
```bash
# Start the application
pm2 start npm --name "momma-me" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

#### Step 8: Configure Nginx (Reverse Proxy)
```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/momma-me
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/momma-me /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

#### Step 9: Setup SSL with Let's Encrypt (Optional but Recommended)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure Nginx and renew certificates
```

#### Step 10: Configure Firewall
```bash
# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 🔧 Configuration Files

### For App Platform:
DigitalOcean App Platform auto-detects Next.js, but you can create `app.yaml` for custom configuration:

```yaml
name: momma-me-ecommerce
region: nyc
services:
- name: web
  source_dir: /
  github:
    repo: your-username/your-repo-name
    branch: main
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 3000
  routes:
  - path: /
  envs:
  - key: NODE_ENV
    value: production
```

---

## 📋 Post-Deployment Checklist

### ✅ Verify Deployment:
- [ ] App loads without errors
- [ ] All pages are accessible
- [ ] Admin panel works (`/admin/login`)
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process works

### 🔐 Security:
- [ ] Change admin password (currently: `mammaandmeadmin`)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up regular backups (if using Droplet)

### 📊 Monitoring:
- [ ] Set up monitoring/alerting
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring

---

## 💰 Cost Estimation

### App Platform:
- **Basic Plan**: $5/month (512 MB RAM, 1 GB storage)
- **Professional Plan**: $12/month (1 GB RAM, 2 GB storage)
- **Scales automatically** based on traffic

### Droplet:
- **Basic Droplet**: $6/month (1 GB RAM, 1 vCPU, 25 GB SSD)
- **Plus Droplet**: $12/month (2 GB RAM, 1 vCPU, 50 GB SSD)
- **More control, but you manage everything**

---

## 🔄 Updating Your App

### App Platform:
- Push changes to GitHub
- DigitalOcean automatically rebuilds and deploys
- Or manually trigger rebuild from dashboard

### Droplet:
```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Navigate to app directory
cd /var/www/your-repo-name

# Pull latest changes
git pull origin main

# Rebuild
npm run build

# Restart with PM2
pm2 restart momma-me
```

---

## 🐛 Troubleshooting

### App Platform Issues:
- **Build Fails**: Check build logs in DigitalOcean dashboard
- **App Crashes**: Check runtime logs
- **Slow Performance**: Upgrade to a larger plan

### Droplet Issues:
- **Can't Connect**: Check firewall rules and SSH keys
- **App Not Starting**: Check PM2 logs: `pm2 logs momma-me`
- **Nginx Errors**: Check Nginx logs: `tail -f /var/log/nginx/error.log`
- **Port Already in Use**: Kill process: `lsof -ti:3000 | xargs kill -9`

### Common Commands (Droplet):
```bash
# View PM2 logs
pm2 logs momma-me

# Restart app
pm2 restart momma-me

# Stop app
pm2 stop momma-me

# View app status
pm2 status

# View Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx
```

---

## 📞 Support Resources

- **DigitalOcean Docs**: [docs.digitalocean.com](https://docs.digitalocean.com)
- **App Platform Docs**: [docs.digitalocean.com/products/app-platform](https://docs.digitalocean.com/products/app-platform)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

## 🎉 You're Ready!

Choose your preferred method:
- **Quick & Easy**: Use App Platform (Option 1)
- **More Control**: Use Droplet (Option 2)

Your app will be live on DigitalOcean! 🚀


