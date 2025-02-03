import wallpaper from 'tauri-plugin-wallpaper';
import { Menu } from '@tauri-apps/api/menu';
import { invoke } from '@tauri-apps/api/core';
import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';

const mainWindow = getCurrentWindow();

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
        console.error('获取并应用壁纸失败:', error);
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