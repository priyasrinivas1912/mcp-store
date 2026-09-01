const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mcpDesktop', {
  getClaudeConfigPath: () => ipcRenderer.invoke('get-claude-config-path'),
  readClaudeConfig: () => ipcRenderer.invoke('read-claude-config'),
  writeClaudeConfig: (config) => ipcRenderer.invoke('write-claude-config', config)
});
