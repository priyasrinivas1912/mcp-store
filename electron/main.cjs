/**
 * MCP Store - Electron Desktop Application Entry Point
 * 
 * Provides native desktop window, system tray integration,
 * and direct 1-click writing to Claude Desktop & Cursor config files.
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: '#050505',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// IPC Handlers for 1-Click Native Config Auto-Updating
ipcMain.handle('get-claude-config-path', () => {
  return getClaudeConfigPath();
});

ipcMain.handle('read-claude-config', () => {
  const targetPath = getClaudeConfigPath();
  try {
    if (fs.existsSync(targetPath)) {
      return JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading claude config:', err);
  }
  return { mcpServers: {} };
});

ipcMain.handle('write-claude-config', (event, newServersConfig) => {
  const targetPath = getClaudeConfigPath();
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let existing = { mcpServers: {} };
  try {
    if (fs.existsSync(targetPath)) {
      existing = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }
  } catch (e) {}

  existing.mcpServers = { ...(existing.mcpServers || {}), ...newServersConfig };
  fs.writeFileSync(targetPath, JSON.stringify(existing, null, 2), 'utf8');
  return { success: true, path: targetPath, config: existing };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
