const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronStore', {
    has: (key) => ipcRenderer.invoke('has-settings', key),
    get: async (key) => await ipcRenderer.invoke('get-settings', key),
    set: async (key, value) => await ipcRenderer.invoke('set-settings', key, value),
    reset: async (key) => await ipcRenderer.invoke('reset-settings', key),
});
