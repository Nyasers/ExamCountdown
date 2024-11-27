const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    applySettings: (callback) => ipcRenderer.on('apply-settings', (_event, _arg) => callback()),
    // hitokotoChange: (callback) => ipcRenderer.on('hitokoto-change', (_event, _arg) => callback()),
});