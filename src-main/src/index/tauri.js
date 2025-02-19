import { defaultWindowIcon } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Menu } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart';
import { relaunch } from "@tauri-apps/plugin-process";
import { load } from '@tauri-apps/plugin-store';
import { check } from "@tauri-apps/plugin-updater";
import wallpaper from 'tauri-plugin-wallpaper';

const store = await load('config.json', { autoSave: true });

const mainWindow = getCurrentWindow();

async function closeWindows() {
    while (window.editor) await window.editor.close();
    await mainWindow.close();
}

export async function checkUpdate() {
    if (!installed) return;
    const update = await check();
    if (update?.available) {
        await update.downloadAndInstall();
        await relaunch();
    }
}

export async function getConfig() {
    return await store.get('config');
}

export async function setConfig(config) {
    await store.set('config', config);
    await store.save();
}

export async function craeteEditor() {
    if (window.editor) return await window.editor.unminimize(), await window.editor.setFocus();

    window.editor = new WebviewWindow('editor', {
        center: true,
        title: "设置",
        url: 'editor.html',
    });

    window.editor.once('tauri://destroyed', () => delete window.editor);

    window.editor.once('tauri://close-requested',
        clearInterval.bind(this, setInterval(async () =>
            setTimeout(await listen('cross-webview-message', e => {
                if (e.payload == "applyConfig") ec.applyConfig();
            }), 1), 1)));
}

export async function attachWallpaper() {
    await wallpaper.attach();
    await mainWindow.show();
}

export async function detachWallpaper() {
    await wallpaper.detach();
    await wallpaper.reset();
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
    });

    const options = {
        menu,
        menuOnLeftClick: true,
        icon: await defaultWindowIcon(),
    };

    const tray = await TrayIcon.new(options);

    return (() => tray.close()).bind(tray);
};

export async function fetchWallpaper() {
    try {
        const imageData = new Uint8Array((await invoke('get_wallpaper_data')));
        return URL.createObjectURL(new Blob([(imageData.buffer)]));
    } catch (error) {
        console.error('获取壁纸失败:', error);
    }
}

const installed = !!await invoke('is_installed');

export function isInstalled() {
    return installed;
}

export async function isAutoStartEnabled() {
    return installed && await isEnabled();
}

export async function enableAutoStart() {
    if (installed && !await isEnabled())
        await enable();
    return await isAutoStartEnabled();
}

export async function disableAutoStart() {
    if (installed && await isEnabled())
        await disable();
    return !await isAutoStartEnabled();
}