const DEFAULT_PORT = 18792
const DEFAULT_HOST = '127.0.0.1'

function clampPort(value) {
  const n = Number.parseInt(String(value || ''), 10)
  if (!Number.isFinite(n)) return DEFAULT_PORT
  if (n <= 0 || n > 65535) return DEFAULT_PORT
  return n
}

function updateRelayUrl() {
  const urlInput = document.getElementById('gateway-url')
  const portInput = document.getElementById('port')
  const displayEl = document.getElementById('relay-url')

  if (!displayEl) return

  const url = urlInput.value.trim()
  if (url) {
    displayEl.textContent = url
  } else {
    const port = clampPort(portInput.value)
    displayEl.textContent = `http://${DEFAULT_HOST}:${port}/`
  }
}

function setStatus(kind, message) {
  const status = document.getElementById('status')
  if (!status) return
  status.dataset.kind = kind || ''
  status.textContent = message || ''
}

async function checkRelayReachable(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 2000)
  try {
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    setStatus('ok', `✅ Relay reachable at ${url}`)
  } catch (err) {
    setStatus(
      'error',
      `❌ Relay not reachable at ${url}. Make sure the gateway is running and accessible.`,
    )
  } finally {
    clearTimeout(t)
  }
}

function getTestUrl() {
  const urlInput = document.getElementById('gateway-url')
  const portInput = document.getElementById('port')

  const url = urlInput.value.trim()
  if (url) {
    // Remove trailing slash and return
    return url.replace(/\/$/, '')
  } else {
    const port = clampPort(portInput.value)
    return `http://${DEFAULT_HOST}:${port}`
  }
}

async function load() {
  const stored = await chrome.storage.local.get(['gatewayUrl', 'relayPort', 'relayHost'])

  // Load gateway URL if configured
  const urlInput = document.getElementById('gateway-url')
  if (stored.gatewayUrl) {
    urlInput.value = stored.gatewayUrl
  }

  // Load port (for backward compatibility)
  const portInput = document.getElementById('port')
  const port = clampPort(stored.relayPort)
  portInput.value = String(port)

  updateRelayUrl()

  // Test connectivity
  const testUrl = getTestUrl()
  await checkRelayReachable(testUrl)
}

async function save() {
  const urlInput = document.getElementById('gateway-url')
  const portInput = document.getElementById('port')

  const url = urlInput.value.trim()
  const port = clampPort(portInput.value)

  // Save both for backward compatibility
  await chrome.storage.local.set({ 
    gatewayUrl: url,
    relayPort: port 
  })

  // Update port input to clamped value
  portInput.value = String(port)

  updateRelayUrl()

  // Test connectivity
  const testUrl = getTestUrl()
  await checkRelayReachable(testUrl)

  setStatus('ok', '💾 Settings saved!')
  setTimeout(() => {
    checkRelayReachable(testUrl)
  }, 1000)
}

function onUrlChange() {
  updateRelayUrl()
  // Clear status when user types
  setStatus('', '')
}

function onPortChange() {
  updateRelayUrl()
  // Clear status when user types
  setStatus('', '')
}

document.getElementById('save').addEventListener('click', () => void save())
document.getElementById('gateway-url').addEventListener('input', onUrlChange)
document.getElementById('port').addEventListener('input', onPortChange)
void load()
