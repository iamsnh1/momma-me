# 🔧 DigitalOcean MCP Server Setup

## What is MCP?

MCP (Model Context Protocol) allows AI assistants to directly interact with DigitalOcean services to:
- Check deployment status
- View build logs
- Manage apps and databases
- Debug issues in real-time

## Setup Instructions

### Step 1: Get Your DigitalOcean API Token

1. Go to: https://cloud.digitalocean.com/account/api/tokens
2. Click **"Generate New Token"**
3. Name it: `MCP Access Token`
4. Set expiration (or no expiration)
5. Select scopes:
   - ✅ **Read** (minimum)
   - ✅ **Write** (if you want AI to make changes)
6. Click **"Generate Token"**
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Configure MCP in Cursor

1. Open Cursor Settings
2. Go to **Features** → **Model Context Protocol** (or **MCP**)
3. Add a new MCP server configuration
4. Use this configuration:

```json
{
  "mcpServers": {
    "digitalocean-apps": {
      "url": "https://apps.mcp.digitalocean.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN_HERE"
      }
    },
    "digitalocean-databases": {
      "url": "https://databases.mcp.digitalocean.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN_HERE"
      }
    }
  }
}
```

**Replace `YOUR_API_TOKEN_HERE` with your actual API token from Step 1.**

### Step 3: Restart Cursor

After adding the configuration, restart Cursor to load the MCP servers.

## Available Services

Once configured, you can use:

- **apps** - App Platform management
- **databases** - Database management
- **droplets** - Droplet management
- **spaces** - Object storage
- **networking** - Networking resources

## Security Note

⚠️ **Keep your API token secure!**
- Never commit it to git
- Use environment variables if possible
- Rotate tokens regularly

## Troubleshooting

If MCP doesn't work:
1. Verify API token is correct
2. Check token has proper scopes
3. Ensure token hasn't expired
4. Restart Cursor after configuration

