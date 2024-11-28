import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { updateElectronApp } from 'update-electron-app'
import { attach, detach, reset } from 'electron-as-wallpaper'
import { app, BrowserWindow, Tray, Menu, Notification, ipcMain } from 'electron'

import { settings } from './settings/settings.js'
import { createWindow as createSettingsWindow } from './settings/main.js'

const isDev = !app.isPackaged

var settingsWindow = null

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

const createWindow = () => {
    // 创建浏览器窗口
    const mainWindow = new BrowserWindow({
        menu: null,
        show: false,
        frame: false,
        fullscreen: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: dirname(fileURLToPath(import.meta.url)) + '\\preload.cjs',
        },
    })

    const webContents = mainWindow.webContents

    // 控制台
    const devTools = (function () {
        if (this.isDevToolsOpened())
            this.closeDevTools()
        this.openDevTools({ mode: 'detach' })
    }).bind(webContents)

    // 网页加载完成后，读取配置文件
    webContents.on('did-finish-load', () => {
        webContents.send('apply-settings')
    })

    // 加载 index.html
    mainWindow.loadFile('index.html')

    // 注册壁纸
    attach(mainWindow, {
        transparent: true,
        forwardMouseInput: false,
        forwardKeyboardInput: false,
    })

    // 设置
    function settings() {
        if (settingsWindow) {
            settingsWindow.focus()
        } else {
            settingsWindow = createSettingsWindow()
            settingsWindow.once('closed', () => {
                webContents.send('apply-settings')
                settingsWindow = null
            })
        }
    }

    // 退出
    function exit() {
        if (settingsWindow)
            settingsWindow.close()
        mainWindow.hide()
        detach(mainWindow)
        mainWindow.close()
    }

    // 系统托盘菜单
    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'DevTools',
            click: devTools,
        },
        // {
        //     label: '一言',
        //     click: webContents.send.bind(null, 'hitokoto-change')
        // },
        {
            label: '设置',
            click: settings,
        },
        {
            label: '退出',
            click: exit,
        },
    ])

    // 注册托盘图标
    app.getFileIcon(process.execPath).then((icon) => {
        const tray = new Tray(icon)
        tray.setToolTip(app.name)
        tray.setContextMenu(trayMenu)
        tray.on('click', trayMenu.popup.bind(trayMenu))
    })

    // 打开开发工具
    if (isDev)
        devTools()

    return mainWindow
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    // 检查操作系统
    if (process.platform !== 'win32') {
        new Notification({
            title: app.getName(),
            body: 'Sorry, this app only works properly on Windows.'
        }).show()
        app.quit()
    }

    // 检查单实例锁
    const lock = app.requestSingleInstanceLock()

    // 如果锁定失败，则退出应用
    if (!lock) {
        new Notification({
            title: app.getName(),
            body: 'Another instance is already running. Exiting...'
        }).show()
        app.quit()
    } else {
        // 注册IPC通信
        ipcMain.handle('get-settings', handleGetSettings)
        ipcMain.handle('set-settings', handleSetSettings)
        ipcMain.handle('has-settings', handleHasSettings)

        // 创建浏览器窗口
        const mainWindow = createWindow()
        mainWindow.once('ready-to-show', () => {
            // 显示窗口
            mainWindow.show()
        })


        // 注册更新服务
        updateElectronApp()
    }
})

// 在程序退出前，重置壁纸
app.on('will-quit', reset)

// 当所有窗口被关闭时退出应用
app.on('window-all-closed', app.quit)

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。