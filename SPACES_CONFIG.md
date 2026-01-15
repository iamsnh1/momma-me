# 🔐 Your DigitalOcean Spaces Configuration

## Your Space Details

- **Space Name (Bucket)**: `imagesmammaandme`
- **Region**: `sfo3`
- **Endpoint**: `sfo3.digitaloceanspaces.com`
- **Access Key ID**: `DO00KKKR2DAE8WG8YGFL`
- **Secret Access Key**: `oOTteDkrTnfQ4CA+/rRyv2ThWrYUy6CL2V9V9QEQb44`

## ✅ Environment Variables to Add

Go to your DigitalOcean App Platform → Settings → App-Level Environment Variables and add these **6 variables**:

```
SPACES_ENDPOINT=sfo3.digitaloceanspaces.com
SPACES_ACCESS_KEY_ID=DO00KKKR2DAE8WG8YGFL
SPACES_SECRET_ACCESS_KEY=oOTteDkrTnfQ4CA+/rRyv2ThWrYUy6CL2V9V9QEQb44
SPACES_BUCKET=imagesmammaandme
SPACES_REGION=sfo3
SPACES_CDN_URL=https://imagesmammaandme.sfo3.cdn.digitaloceanspaces.com
```

**Copy and paste these exactly as shown above!**

## After Adding Variables

1. Click "Save" in DigitalOcean
2. Wait 2-3 minutes for redeployment
3. Test by uploading an image in `/admin/banners`
4. Images will now be stored in Spaces and visible to all users!

## Your Space URLs

- **Direct URL**: `https://imagesmammaandme.sfo3.digitaloceanspaces.com/`
- **CDN URL**: `https://imagesmammaandme.sfo3.cdn.digitaloceanspaces.com/` (if CDN enabled)

