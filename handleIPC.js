import { ipcMain } from "electron"
import { settings } from "./settings/settings.js"

function handleHasSettings(_event, key) {
    return settings.has(key)
}

async function handleGetSettings(_event, key) {
    return settings.get(key)
}

async function handleSetSettings(_event, key, value) {
    if (settings.has(key))
        settings.set(key, value)
    return settings.get(key)
}

export default function () {
    ipcMain.handle('get-settings', handleGetSettings)
    ipcMain.handle('set-settings', handleSetSettings)
    ipcMain.handle('has-settings', handleHasSettings)
}

