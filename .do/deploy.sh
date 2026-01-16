#!/bin/bash
# Deployment script for DigitalOcean Droplet

set -e

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /var/www/momma-me-ecommerce || exit

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build application
echo "🔨 Building application..."
npm run build

# Restart application with PM2
echo "🔄 Restarting application..."
pm2 restart momma-me || pm2 start npm --name "momma-me" -- start

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 Application status:"
pm2 status




