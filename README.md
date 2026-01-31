# Moltbot Browser Relay - Modified for Tailscale Support

## 🎯 What's New

This modified version of the Moltbot Browser Relay Chrome Extension adds support for **remote gateway connections via Tailscale or HTTPS**.

### Key Changes:

✅ **Full Gateway URL Configuration** - Connect to remote gateways via Tailscale or HTTPS
✅ **Backward Compatible** - Still works with local port configuration
✅ **Secure WebSocket Support** - Supports WSS (secure WebSocket) connections
✅ **Enhanced Permissions** - Added HTTPS and WSS host permissions

---

## 📦 Installation

### Step 1: Remove Old Extension (if installed)

1. Open Chrome and go to `chrome://extensions/`
2. Find **"Moltbot Browser Relay"**
3. Click **"Remove"**

### Step 2: Install Modified Extension

1. **Extract this ZIP file** to a permanent location (e.g., `C:\Users\jeff\moltbot\chrome-extension-modified`)
   - ⚠️ **Important:** Do NOT delete this folder after installation!
   - Chrome loads unpacked extensions from their source folder

2. Open Chrome and go to `chrome://extensions/`

3. Enable **"Developer mode"** (toggle in top-right corner)

4. Click **"Load unpacked"**

5. Select the extracted folder (the one containing `manifest.json`)

6. The extension should now appear in your extensions list

---

## ⚙️ Configuration

### For Remote Gateway (Tailscale/HTTPS)

1. Click the **Moltbot Browser Relay** extension icon in Chrome toolbar

2. Click **"Options"** or right-click the icon → **"Options"**

3. In the **"Gateway URL (Remote/Tailscale)"** section:
   - Enter your full gateway URL
   - Example: `https://your-gateway.tailscale.ts.net/relay`

4. Click **"Save Settings"**

5. Wait for the status message:
   - ✅ Green = Connected successfully
   - ❌ Red = Connection failed (check URL and gateway status)

### For Local Gateway (Localhost)

1. Leave the **"Gateway URL"** field **empty**

2. In the **"Local Port"** section:
   - Enter your port (default: `18792`)

3. Click **"Save Settings"**

---

## 🔧 Your Specific Configuration

**Your Tailscale Gateway URL:**
```
https://your-gateway.tailscale.ts.net/relay
```

**Steps:**
1. Install the extension (see above)
2. Open extension options
3. Paste the URL above into the "Gateway URL" field
4. Click "Save Settings"
5. Look for green ✅ status message

---

## 🧪 Testing

1. Open any website in Chrome

2. Click the **Moltbot Browser Relay** icon

3. The badge should show:
   - **"ON"** (orange) = Connecting
   - **"ON"** (red) = Connected
   - **"!"** (red) = Error (check options)

4. If you see **"!"** (error):
   - Open extension options
   - Check the status message
   - Verify your gateway URL is correct
   - Ensure your gateway is running and accessible

---

## 🔍 Troubleshooting

### Extension shows red "!" badge

**Cause:** Cannot connect to gateway

**Solutions:**
1. Open extension options and check status message
2. Verify gateway URL is correct
3. Ensure gateway is running on EC2
4. Check Tailscale connection: `tailscale status`
5. Test gateway manually: Open `https://your-gateway.tailscale.ts.net/relay` in browser

### "Relay not reachable" error

**Cause:** Gateway is not accessible at the configured URL

**Solutions:**
1. Verify Tailscale Serve is running: `tailscale serve status`
2. Check gateway service: `systemctl --user status moltbot-gateway`
3. Ensure `/relay` path is configured in Tailscale Serve
4. Test with curl: `curl https://your-gateway.tailscale.ts.net/relay/`

### Extension connects but tasks don't execute

**Cause:** Moltbot node is not connected to gateway

**Solutions:**
1. Check node service: `systemctl --user status moltbot-node`
2. Check node logs: `journalctl --user -u moltbot-node -n 50`
3. Verify node is connecting to gateway

---

## 📚 Technical Details

### Modified Files:

- **background.js** - Added `getGatewayUrl()` function and dynamic URL handling
- **options.js** - Added gateway URL configuration and validation
- **options.html** - Added gateway URL input field and improved UI
- **manifest.json** - Added HTTPS and WSS host permissions

### How It Works:

1. Extension reads `gatewayUrl` from Chrome storage
2. If URL is set, uses it directly
3. If URL is empty, falls back to `http://127.0.0.1:<port>` (backward compatible)
4. Constructs WebSocket URL based on protocol (ws:// or wss://)
5. Connects to gateway and establishes CDP relay

### Storage Keys:

- `gatewayUrl` - Full gateway URL (e.g., "https://example.com/relay")
- `relayPort` - Port number for localhost mode (default: 18792)
- `relayHost` - Host for localhost mode (default: 127.0.0.1)

---

## 🔐 Security Notes

- Extension requires broad host permissions (`https://*/*`, `wss://*/*`) to connect to any gateway
- This is necessary for Tailscale and remote gateway support
- Only install this extension if you trust the gateway you're connecting to
- Recommended: Use Tailscale for secure, private network connections

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review gateway and node logs
3. Verify Tailscale configuration
4. Test gateway accessibility manually

---

## 📄 License

Same as original Moltbot Browser Relay extension.

---

**Modified by:** Agent Zero  
**Date:** 2026-01-31  
**Purpose:** Enable remote gateway connections via Tailscale/HTTPS
