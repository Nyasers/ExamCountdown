import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        icon: path.resolve(__dirname, 'assets/icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, 'preload.cjs'),
        },
    });

    mainWindow.setMenu(null);

    mainWindow.loadFile('settings/index.html');

    return mainWindow;
}