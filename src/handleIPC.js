import { ipcMain } from "electron"
import { settings } from "./settings/settings.js"

function handleHasSettings(event, key) {
    event.preventDefault()
    return settings.has(key)
}

async function handleGetSettings(event, key) {
    event.preventDefault()
    if ("undefined" === typeof key || settings.has(key)) {
        return settings.get(key)
    } else {
        throw new Error(`Key '${key}' not found in settings`)
    }
}

async function handleSetSettings(event, key, value) {
    event.preventDefault()
    if (settings.has(key)) {
        settings.set(key, value)
        return settings.get(key)
    } else {
        throw new Error(`Key '${key}' not found in settings`)
    }
}

async function handleResetSettings(event, key) {
    event.preventDefault();
    if (settings.has(key)) {
        settings.reset(key)
    } else {
        throw new Error(`Key '${key}' not found in settings`)
    }
}

export default function () {
    ipcMain.handle('has-settings', handleHasSettings)
    ipcMain.handle('get-settings', handleGetSettings)
    ipcMain.handle('set-settings', handleSetSettings)
    ipcMain.handle('reset-settings', handleResetSettings)
}
