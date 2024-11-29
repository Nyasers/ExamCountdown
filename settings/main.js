import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron';

export function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: dirname(fileURLToPath(import.meta.url)) + '\\preload.cjs',
        },
    });

    mainWindow.setMenu(null);

    mainWindow.loadFile('settings/index.html');

    return mainWindow;
}