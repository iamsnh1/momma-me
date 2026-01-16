# 🐛 Debugging Deployment Issues

## Current Status

✅ **Local build works** - Code compiles successfully  
❌ **Deployment fails** - Non-zero exit code

## Common Causes

### 1. Build Command Mismatch

Your `.do/app.yaml` uses:
```yaml
build_command: npm install && npm run build
```

But DigitalOcean might be using:
```bash
npm ci && npm run build
```

**Fix:** Update `.do/app.yaml` to match:
```yaml
build_command: npm ci && npm run build
```

### 2. Missing Files

The `data/database.json` file might not be in the deployment.

**Check:**
```bash
git ls-files data/
```

Should show:
- `data/database.json`
- `data/products.ts`

### 3. Node Version Mismatch

DigitalOcean might be using a different Node version.

**Fix:** Add to `.do/app.yaml`:
```yaml
envs:
  - key: NODE_VERSION
    value: "20.x"  # or 18.x
```

### 4. File System Permissions

Serverless environments have read-only filesystems.

**Current Fix:** The code now handles this gracefully with try-catch blocks.

## Manual Debugging Steps

### Option 1: Check DigitalOcean Logs

1. Go to: https://cloud.digitalocean.com/apps
2. Click your app
3. Go to **Runtime Logs** tab
4. Look for build errors

### Option 2: Use doctl CLI

```bash
# Install doctl
brew install doctl  # macOS
# or download from: https://github.com/digitalocean/doctl

# Authenticate
doctl auth init

# Check app status
doctl apps get YOUR_APP_ID

# View build logs
doctl apps logs YOUR_APP_ID --type build

# View runtime logs
doctl apps logs YOUR_APP_ID --type run
```

### Option 3: Build Locally with Same Command

```bash
# Use the same command DigitalOcean uses
npm ci
npm run build

# If this fails, you'll see the same error
```

## Quick Fixes to Try

### Fix 1: Update Build Command

```yaml
# .do/app.yaml
build_command: npm ci && npm run build
```

### Fix 2: Ensure All Files Are Committed

```bash
git add -A
git commit -m "Ensure all files are committed"
git push origin main
```

### Fix 3: Check for TypeScript Errors

```bash
npm run build
# Look for TypeScript errors
```

## Next Steps

1. **Check DigitalOcean logs** for the exact error
2. **Update build command** if needed
3. **Verify all files** are committed
4. **Test locally** with `npm ci && npm run build`

---

**Once MCP is configured, I can check logs directly!**

