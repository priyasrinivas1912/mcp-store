#!/usr/bin/env node
/**
 * MCP Desktop Companion Daemon & 1-Click Claude Config Auto-Updater
 * 
 * Reads the OS-specific Claude Desktop configuration path,
 * connects with the MCP Store API, and automatically writes / updates
 * `claude_desktop_config.json` without requiring manual file editing.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');

function getClaudeConfigPath() {
  const platform = os.platform();
  const homedir = os.homedir();

  if (platform === 'darwin') {
    return path.join(homedir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
    return path.join(appData, 'Claude', 'claude_desktop_config.json');
  } else {
    return path.join(homedir, '.config', 'Claude', 'claude_desktop_config.json');
  }
}

function readCurrentConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`[WARN] Could not parse existing config: ${err.message}. Initializing fresh config.`);
  }
  return { mcpServers: {} };
}

function updateClaudeConfig(serverConfig) {
  const configPath = getClaudeConfigPath();
  const configDir = path.dirname(configPath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log(`[INFO] Created directory: ${configDir}`);
  }

  const current = readCurrentConfig(configPath);
  if (!current.mcpServers) {
    current.mcpServers = {};
  }

  Object.assign(current.mcpServers, serverConfig);

  fs.writeFileSync(configPath, JSON.stringify(current, null, 2), 'utf8');
  console.log(`\n========================================================`);
  console.log(`[SUCCESS] Claude Desktop Configuration Updated Successfully!`);
  console.log(`Target File: ${configPath}`);
  console.log(`Active Servers (${Object.keys(current.mcpServers).length}): ${Object.keys(current.mcpServers).join(', ')}`);
  console.log(`========================================================\n`);
  return current;
}

// Start a lightweight local companion daemon on port 4000/4001 to handle 1-click web-to-desktop installs
const DAEMON_PORT = process.env.MCP_DAEMON_PORT || 4001;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.url === '/ping' || req.url === '/api/daemon/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'online',
      platform: os.platform(),
      claudeConfigPath: getClaudeConfigPath(),
      exists: fs.existsSync(getClaudeConfigPath())
    }));
  }

  if (req.url === '/api/daemon/install' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { serverId, serverConfig } = payload;
        const updated = updateClaudeConfig({ [serverId]: serverConfig });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, updatedConfig: updated }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(DAEMON_PORT, () => {
  console.log(`\n⚡ MCP Desktop Auto-Updater Companion Running on http://127.0.0.1:${DAEMON_PORT}`);
  console.log(`📁 Auto-detected Claude Desktop Path: ${getClaudeConfigPath()}`);
});
