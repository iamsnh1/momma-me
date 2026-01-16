# ⚡ Quick Setup - DigitalOcean Spaces

## Copy These Environment Variables

Go to: **DigitalOcean App Platform → Your App → Settings → App-Level Environment Variables**

Add these 6 variables (click "Edit" or "Add Variable" for each):

```bash
SPACES_ENDPOINT=sfo3.digitaloceanspaces.com
SPACES_ACCESS_KEY_ID=DO00KKKR2DAE8WG8YGFL
SPACES_SECRET_ACCESS_KEY=oOTteDkrTnfQ4CA+/rRyv2ThWrYUy6CL2V9V9QEQb44
SPACES_BUCKET=imagesmammaandme
SPACES_REGION=sfo3
SPACES_CDN_URL=https://imagesmammaandme.sfo3.cdn.digitaloceanspaces.com
```

## Steps:

1. ✅ Go to: https://cloud.digitalocean.com/apps
2. ✅ Click your app name
3. ✅ Click "Settings" tab
4. ✅ Click "App-Level Environment Variables"
5. ✅ Click "Edit" or "Add Variable"
6. ✅ Add each variable one by one (copy from above)
7. ✅ Click "Save"
8. ✅ Wait 2-3 minutes for redeployment
9. ✅ Test by uploading an image in `/admin/banners`

## After Setup:

- Images will upload to DigitalOcean Spaces
- Images will be accessible to ALL users (not just your device)
- Images will load faster via CDN
- No more localStorage-only images!

## Test It:

1. Go to `/admin/banners`
2. Click "Add New Banner"
3. Upload an image
4. Check the image URL - it should start with `https://imagesmammaandme.sfo3.cdn.digitaloceanspaces.com/`
5. ✅ Success! Image is now in Spaces and visible to everyone!


