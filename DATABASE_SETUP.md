# 🗄️ Database Setup Guide

## ✅ Database Implementation Complete!

Your app now uses a **shared database** so all users can access the same products and images!

## 📋 Current Implementation

### File-Based Database (Development)
- Uses `data/database.json` to store all data
- Works immediately without setup
- Perfect for development and small deployments
- Data is committed to git and deployed with your app

### API Routes Created
- `/api/products` - Get all products, create product
- `/api/products/[id]` - Get, update, delete product
- `/api/images/store` - Upload image to database
- `/api/images/[id]` - Retrieve image from database

## 🚀 Upgrade to PostgreSQL (Production)

For production with many users, upgrade to PostgreSQL:

### Option 1: DigitalOcean Managed Database (Recommended)

1. **Create Database:**
   - Go to DigitalOcean → Databases → Create Database
   - Choose PostgreSQL
   - Select region (same as your app)
   - Choose plan (Basic $15/month minimum)

2. **Connect to App:**
   - In your app settings, go to "Components"
   - Add a database component
   - Select your PostgreSQL database
   - DigitalOcean will set `DATABASE_URL` automatically

3. **Update Code:**
   - Install PostgreSQL client: `npm install pg`
   - Update `lib/db.ts` to use PostgreSQL instead of JSON file
   - Database connection will be automatic via `DATABASE_URL`

### Option 2: MongoDB Atlas (Alternative)

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster

2. **Get Connection String:**
   - Copy your MongoDB connection string
   - Add as `MONGODB_URI` environment variable

3. **Update Code:**
   - Install MongoDB: `npm install mongodb`
   - Update `lib/db.ts` to use MongoDB

## 📊 Current Database Schema

### Products
```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "image": "string (URL)",
  "category": "string",
  // ... other product fields
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Images
```json
{
  "id": "string",
  "filename": "string",
  "data": "base64 string",
  "mimeType": "string",
  "size": "number",
  "createdAt": "ISO date"
}
```

## ✅ Benefits

- ✅ **Shared Data** - All users see the same products
- ✅ **Universal Images** - Images accessible to everyone
- ✅ **Persistent** - Data survives deployments
- ✅ **Scalable** - Easy to upgrade to PostgreSQL

## 🔄 Migration from localStorage

The app now automatically:
1. Fetches products from database on load
2. Saves new products to database
3. Updates products in database
4. Stores images in database

No manual migration needed - it works automatically!

## 💡 Next Steps

1. **Test the current setup** - It works with JSON file database
2. **For production** - Upgrade to PostgreSQL when ready
3. **Monitor usage** - JSON file works for small-medium sites

---

**Your app is now using a shared database! All users will see the same products and images.** 🎉

