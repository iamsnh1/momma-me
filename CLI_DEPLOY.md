# 🚀 Deploy via CLI (Alternative Method)

## Prerequisites

1. ✅ `doctl` is installed and authenticated (already done!)
2. Your GitHub repository URL
3. Code pushed to GitHub

---

## Quick CLI Deploy

### Step 1: Update app.yaml with your GitHub repo

Edit `.do/app.yaml` and replace:
```yaml
github:
  repo: your-username/your-repo-name
```

With your actual GitHub repository:
```yaml
github:
  repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
```

### Step 2: Create the app

```bash
doctl apps create --spec .do/app.yaml
```

### Step 3: Check deployment status

```bash
doctl apps list
doctl apps get <APP-ID>
```

---

## Or Use Web Interface (Easier)

The web interface is actually easier for first-time deployment:

1. Go to: https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub
4. Select your repo
5. Deploy!

See `DEPLOY_NOW.md` for detailed web interface steps.


