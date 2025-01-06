import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        icon: path.resolve(__dirname, '../../assets/icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, 'preload.cjs'),
        },
    });

    mainWindow.setMenu(null);

    mainWindow.webContents.on('did-finish-load', () => {
        fs.readFile(path.resolve(__dirname, 'renderer.js'), 'utf-8', (err, data) => {
            if (err) throw err;
            mainWindow.webContents.executeJavaScript(data);
        });
    });

    mainWindow.loadFile(path.resolve(__dirname, 'index.html'));

    return mainWindow;
}