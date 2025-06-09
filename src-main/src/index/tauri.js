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
    if (!installed) {
        console.log('未安装，无法更新。');
        return;
    }
    const update = await check();
    if (update && update.version !== update.currentVersion) {
        console.log(`发现新版本：${update.version}，开始下载...`);
        await update.downloadAndInstall((progress) => {
            let percent = 0;
            if (progress.event === 'Started') {
                console.log('更新下载开始');
            }
            if (progress.event === 'Progress') {
                const contentLength = progress.data?.contentLength;
                if (contentLength) {
                    percent = (progress.data?.downloadedBytes / contentLength) * 100;
                } else {
                    percent = progress.data?.downloadedBytes || 0;
                }
                console.log(`下载进度: ${percent.toFixed(2)}%`);
            }
            if (progress.event === 'Finished') {
                console.log('更新下载完成，准备安装并重启...');
            }
        }).then(() => {
            relaunch().then(() => {
                closeWindows();
            }).catch((error) => {
                console.error('重启应用失败:', error);
            });
        }).catch((error) => {
            console.error('更新下载或安装失败:', error);
        });
    } else {
        console.log('当前已是最新版本。');
    }
}

export async function getConfig() {
    return await store.get('config')
}

export async function setConfig(config) {
    await store.set('config', config)
    await store.save()
}

export async function createEditor() {
    if (window.editor) return await window.editor.unminimize(), await window.editor.setFocus()

    window.editor = new WebviewWindow('editor', {
        center: true,
        title: "设置",
        url: 'editor.html',
    })

    const interval = setInterval(async () =>
        setTimeout(await listen('cross-webview-message', e => {
            if (e.payload == "applyConfig") ec.applyConfig()
        }), 1e3), 1e3);

    window.editor.once('tauri://destroyed', () => { window.clearInterval(interval); delete window.editor })
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
    // 创建菜单，直接在菜单项中定义action
    const menu = await Menu.new({
        items: [
            {
                id: 'checkUpdate',
                text: '检查更新',
                enabled: installed,
                action() {
                    console.log(`菜单项 checkUpdate 被点击`);
                    checkUpdate();
                }
            },
            {
                id: 'settings',
                text: '设置',
                action() {
                    console.log(`菜单项 settings 被点击`);
                    createEditor();
                }
            },
            {
                id: 'quit',
                text: '退出',
                action() {
                    console.log(`菜单项 quit 被点击`);
                    closeWindows();
                }
            },
        ],
    });

    const options = {
        menu,
        menuOnLeftClick: true,
        tooltip: "ExamCountdown",
        icon: await defaultWindowIcon(),
    };

    const tray = await TrayIcon.new(options);

    const close = async function () {
        await tray.close();
    };

    console.log('托盘图标已创建');

    return close;
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