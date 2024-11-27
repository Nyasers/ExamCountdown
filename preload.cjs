const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    applySettings: (callback) => ipcRenderer.on('apply-settings', (_event, arg) => callback(arg)),
});