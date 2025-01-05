const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronStore', {
    get: async (key) => await ipcRenderer.invoke('get-settings', key),
    set: async (key, value) => await ipcRenderer.invoke('set-settings', key, value),
    onApply: (callback) => ipcRenderer.on('apply-settings', (_event, _arg) => callback()),
    // hitokotoChange: (callback) => ipcRenderer.on('hitokoto-change', (_event, _arg) => callback()),
});