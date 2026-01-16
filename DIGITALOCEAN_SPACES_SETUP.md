# 🚀 DigitalOcean Spaces Setup Guide

## Overview

DigitalOcean Spaces is S3-compatible object storage that allows you to store images and make them accessible to all users. This replaces the localStorage approach which only works on a single device.

## Step 1: Create a DigitalOcean Space

1. **Log in to DigitalOcean:**
   - Go to: https://cloud.digitalocean.com/

2. **Create a Space:**
   - Click "Spaces" in the left sidebar
   - Click "Create a Space"
   - Choose settings:
     - **Name**: `momma-me-images` (or your preferred name)
     - **Region**: Choose closest to your users (e.g., `nyc3`, `sfo3`, `ams3`)
     - **CDN**: ✅ Enable CDN (recommended for faster image loading)
   - Click "Create a Space"

3. **Get your Space details:**
   - After creation, note your Space endpoint (e.g., `nyc3.digitaloceanspaces.com`)
   - Note your Space name (the name you chose)

## Step 2: Generate Access Keys

1. **Go to API section:**
   - Click "API" in the left sidebar
   - Click "Spaces Keys" tab
   - Click "Generate New Key"

2. **Name your key:**
   - Name: `momma-me-upload-key`
   - Click "Generate Key"

3. **Save your credentials:**
   - ⚠️ **IMPORTANT**: Copy and save these immediately (you won't see them again):
     - **Access Key** (starts with something like `DO...`)
     - **Secret Key** (long random string)
   - Store them securely

## Step 3: Configure Environment Variables

1. **Go to your DigitalOcean App:**
   - Navigate to your App Platform dashboard
   - Click on your app
   - Go to "Settings" → "App-Level Environment Variables"

2. **Add these environment variables:**

   ```
   SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
   SPACES_ACCESS_KEY_ID=your-access-key-here
   SPACES_SECRET_ACCESS_KEY=your-secret-key-here
   SPACES_BUCKET=momma-me-images
   SPACES_REGION=nyc3
   SPACES_CDN_URL=https://momma-me-images.nyc3.cdn.digitaloceanspaces.com
   ```

   **Replace with your actual values:**
   - `SPACES_ENDPOINT`: Your Space endpoint (e.g., `nyc3.digitaloceanspaces.com`)
   - `SPACES_ACCESS_KEY_ID`: The Access Key you generated
   - `SPACES_SECRET_ACCESS_KEY`: The Secret Key you generated
   - `SPACES_BUCKET`: Your Space name
   - `SPACES_REGION`: Your Space region (e.g., `nyc3`, `sfo3`, `ams3`)
   - `SPACES_CDN_URL`: Your CDN URL (if CDN is enabled, format: `https://your-space-name.region.cdn.digitaloceanspaces.com`)

3. **Save and Redeploy:**
   - Click "Save"
   - Your app will automatically redeploy

## Step 4: Set Space Permissions (Important!)

1. **Go to your Space:**
   - Click "Spaces" → Your Space name

2. **Set File Listing:**
   - Go to "Settings" tab
   - Under "File Listing", select "File Listing Enabled" (optional, for debugging)

3. **Set CORS (if needed):**
   - Go to "Settings" → "CORS Configurations"
   - Add CORS rule:
     ```
     Allowed Origins: *
     Allowed Methods: GET, PUT, POST, DELETE, HEAD
     Allowed Headers: *
     Max Age: 3600
     ```

## Step 5: Test the Upload

1. **After redeployment:**
   - Go to your admin panel: `/admin/banners`
   - Try uploading an image
   - It should upload to DigitalOcean Spaces
   - The image URL should be accessible to all users

## Cost Estimate

DigitalOcean Spaces pricing:
- **Storage**: $5/month for 250 GB
- **Bandwidth**: 1 TB/month included, then $0.01/GB
- **CDN**: Included with Spaces

For a small e-commerce site, you'll likely stay within the free tier or pay ~$5-10/month.

## Troubleshooting

### Images not uploading:
- ✅ Check all environment variables are set correctly
- ✅ Verify Access Key and Secret Key are correct
- ✅ Ensure Space name matches `SPACES_BUCKET`
- ✅ Check Space region matches `SPACES_REGION`

### Images not accessible:
- ✅ Verify Space has "File Listing" enabled (or files are public)
- ✅ Check CDN URL is correct if using CDN
- ✅ Verify file permissions are set to public-read

### Upload errors:
- Check DigitalOcean App logs for detailed error messages
- Verify file size is under 10MB
- Ensure file is a valid image format (JPG, PNG, WEBP, etc.)

## Security Notes

- ⚠️ **Never commit** your Access Keys or Secret Keys to Git
- ✅ Environment variables are secure in DigitalOcean App Platform
- ✅ API route handles uploads server-side (keys never exposed to client)
- ✅ Files are stored with public-read ACL for universal access

## Next Steps

After setup:
1. Test uploading a banner image
2. Test uploading a product image
3. Verify images appear for all users
4. Check image URLs in browser (should be from your Space CDN)

🎉 **You're all set!** Images will now be stored in DigitalOcean Spaces and accessible to all users!


