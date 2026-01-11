# M💗mma & Me - E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js, React, and TypeScript.

## 🚀 Features

- **Product Catalog**: Browse products by category
- **Shopping Cart**: Add items to cart with real-time updates
- **Admin Panel**: Complete admin dashboard for managing:
  - Products
  - Categories
  - Orders
  - Customers
  - Banners & Ads
  - Trust Badges
  - Footer Settings
  - Application Settings
- **Order Management**: Track and manage customer orders
- **Customer Management**: View and manage customer data
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: React Icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Admin Access

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `mammaandmeadmin`

## 📝 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:

1. **Vercel** (Recommended - Easiest)
   - Push to GitHub
   - Import to Vercel
   - Auto-deploy

2. **DigitalOcean App Platform** (Recommended - Great Value)
   - Push to GitHub
   - Create app on DigitalOcean
   - Connect repository
   - Auto-deploy
   - See [DIGITALOCEAN_DEPLOY.md](./DIGITALOCEAN_DEPLOY.md) for detailed guide

3. **Netlify**
   - Push to GitHub
   - Import to Netlify
   - Configure build settings

4. **Railway/Render**
   - Push to GitHub
   - Connect repository
   - Deploy

## 📁 Project Structure

```
├── app/                 # Next.js app directory
│   ├── admin/          # Admin panel routes
│   ├── cart/           # Cart page
│   ├── checkout/       # Checkout page
│   └── page.tsx        # Home page
├── components/          # React components
├── store/              # Zustand stores
├── data/               # Static data
└── public/             # Static assets
```

## 🎨 Features Overview

### Customer Features
- Browse products by category
- Search and filter products
- Add to cart
- View product details
- Checkout process
- Order confirmation

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Category management
- Order management with status updates
- Customer management
- Banner & ad management
- Trust badge management
- Footer content editing
- Application settings

## 🔄 Data Storage

Currently, all data is stored in browser localStorage. This means:
- Each user has their own data
- Data persists across sessions
- No backend required

**Note**: For production with shared data, consider implementing a backend API.

## 🐛 Troubleshooting

### Build Issues
- Ensure Node.js 18+ is installed
- Run `npm install` before building
- Clear `.next` folder if needed: `rm -rf .next`

### Runtime Issues
- Check browser console for errors
- Verify all dependencies are installed
- Check hosting platform logs

## 📄 License

Private project - All rights reserved

## 👥 Support

For issues or questions, please check the deployment guide or contact support.

---

Built with ❤️ using Next.js
