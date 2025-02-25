const { defaultWindowIcon } = await import('@tauri-apps/api/app');
const { invoke } = await import('@tauri-apps/api/core');
const { listen } = await import('@tauri-apps/api/event');
const { Menu } = await import('@tauri-apps/api/menu');
const { TrayIcon } = await import('@tauri-apps/api/tray');
const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');
const { getCurrentWindow } = await import('@tauri-apps/api/window');
const { disable, enable, isEnabled } = await import('@tauri-apps/plugin-autostart');
const { relaunch } = await import("@tauri-apps/plugin-process");
const { load } = await import('@tauri-apps/plugin-store');
const { check } = await import("@tauri-apps/plugin-updater");
const { default: wallpaper } = await import('tauri-plugin-wallpaper');

const store = await load('config.json', { autoSave: true })

const mainWindow = getCurrentWindow()

async function closeWindows() {
    while (window.editor) await window.editor.close()
    await mainWindow.close()
}

export async function checkUpdate() {
    if (!installed) return
    const update = await check()
    if (update?.available) {
        await update.downloadAndInstall()
        await relaunch()
    }
}

export async function getConfig() {
    return await store.get('config')
}

export async function setConfig(config) {
    await store.set('config', config)
    await store.save()
}

export async function craeteEditor() {
    if (window.editor) return await window.editor.unminimize(), await window.editor.setFocus()

    window.editor = new WebviewWindow('editor', {
        center: true,
        title: "设置",
        url: 'editor.html',
    })

    window.editor.once('tauri://destroyed', () => delete window.editor)

    window.editor.once('tauri://close-requested',
        clearInterval.bind(this, setInterval(async () =>
            setTimeout(await listen('cross-webview-message', e => {
                if (e.payload == "applyConfig") ec.applyConfig()
            }), 1), 1)))
}

export async function attachWallpaper() {
    await wallpaper.attach()
    await mainWindow.show()
}

export async function detachWallpaper() {
    await wallpaper.detach()
    await wallpaper.reset()
}

export async function createTray() {
    const menu = await Menu.new({
        items: [
            {
                id: 'settings',
                text: '设置',
                action: craeteEditor,
            },
            {
                id: 'quit',
                text: '退出',
                action: closeWindows,
            },
        ],
    })

    const options = {
        menu,
        menuOnLeftClick: true,
        icon: await defaultWindowIcon(),
    }

    const tray = await TrayIcon.new(options)

    return (() => tray.close()).bind(tray)
}

export async function fetchWallpaper() {
    try {
        const imageData = new Uint8Array((await invoke('get_wallpaper_data')))
        return URL.createObjectURL(new Blob([(imageData.buffer)]))
    } catch (error) {
        console.error('获取壁纸失败:', error)
    }
}

const installed = !!await invoke('is_installed')

export function isInstalled() {
    return installed
}

export async function isAutoStartEnabled() {
    return installed && await isEnabled()
}

export async function enableAutoStart() {
    if (installed && !await isEnabled())
        await enable()
    return await isAutoStartEnabled()
}

export async function disableAutoStart() {
    if (installed && await isEnabled())
        await disable()
    return !await isAutoStartEnabled()
}