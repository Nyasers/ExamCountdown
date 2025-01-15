import wallpaper from 'tauri-plugin-wallpaper';
import { Menu } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';

const mainWindow = getCurrentWindow();

export const attachWallpaper = async () => {
    await wallpaper.attach();
    await mainWindow.show();
}

export const detachWallpaper = async () => {
    await wallpaper.detach();
    await wallpaper.reset();
}

export const createTray = async () => {
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
