# 🖼️ ImgBB Image Upload Setup

## Quick Setup (5 minutes)

ImgBB is a **free, simple image hosting service** that works client-side. No server configuration needed!

### Step 1: Get Free API Key

1. Go to: **https://api.imgbb.com/**
2. Click **"Get API Key"** or **"Sign Up"**
3. Sign up with email (free, no credit card)
4. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Add to DigitalOcean App Platform

1. Go to your **DigitalOcean App Platform** dashboard
2. Select your app → **Settings** → **App-Level Environment Variables**
3. Click **"Edit"** or **"Add Variable"**
4. Add:
   - **Key:** `NEXT_PUBLIC_IMGBB_API_KEY`
   - **Value:** `your-api-key-here` (paste the key you copied)
5. Click **"Save"**
6. **Redeploy** your app (or it will auto-deploy)

### Step 3: Test Upload

1. Go to your admin panel
2. Try uploading an image
3. ✅ It should upload to ImgBB and be visible to all users!

## Why ImgBB?

- ✅ **Free** - No credit card required
- ✅ **Simple** - Just one API key, no server setup
- ✅ **Fast** - Client-side uploads
- ✅ **Reliable** - No complex configuration
- ✅ **Universal** - Images visible to all users

## Troubleshooting

### "ImgBB API key not configured"
- Make sure you added `NEXT_PUBLIC_IMGBB_API_KEY` to environment variables
- Make sure you **redeployed** after adding the variable
- Check that the variable name is exactly `NEXT_PUBLIC_IMGBB_API_KEY`

### "Upload failed"
- Check your API key is correct
- Make sure image is under 32MB (ImgBB limit)
- Check browser console for detailed error

### Alternative: Use Image URLs

If you don't want to set up ImgBB, you can:
1. Upload images to **Imgur** (https://imgur.com/upload)
2. Copy the image URL
3. Paste it in the "Enter Image URL" field

## Cost

**ImgBB is completely FREE** for:
- Unlimited uploads
- No bandwidth limits
- No storage limits
- No expiration

Perfect for e-commerce sites! 🎉

