import wallpaper from 'tauri-plugin-wallpaper';
import { Menu } from '@tauri-apps/api/menu';
import { invoke } from '@tauri-apps/api/core';
import { TrayIcon } from '@tauri-apps/api/tray';
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';

import { load } from '@tauri-apps/plugin-store';

const store = await load('store.json', { autoSave: true });

const mainWindow = getCurrentWindow();

export async function checkUpdate() {
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
    const webview = new WebviewWindow('editor', {
        center: true,
        title: "Config Editor - ExamCountdown",
        url: 'editor.html',
    });

    webview.once('tauri://destroyed', ec.applyConfig);

    return webview;
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
                action: mainWindow.close,
            },
        ],
    });

    const options = {
        menu,
        menuOnLeftClick: true,
        icon: await defaultWindowIcon(),
    };

    return await TrayIcon.new(options);
};

export async function fetchWallpaper() {
    try {
        const imageData = new Uint8Array((await invoke('get_wallpaper_data')));
        return URL.createObjectURL(new Blob([(imageData.buffer)]));
    } catch (error) {
        console.error('获取壁纸失败:', error);
    }
}

const installed = await invoke('is_installed');

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