import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { updateElectronApp } from 'update-electron-app'
import { attach, detach, reset } from 'electron-as-wallpaper'
import { app, BrowserWindow, Tray, Menu, dialog } from 'electron'

import assets from './assets.js'
import initIPC from './handleIPC.js'
import { createWindow as createSettingsWindow } from './settings/main.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const win11 = process.platform === 'win32' && os.release().startsWith('10.0.22')

var wallpaper = false
var settingsWindow = null

if (app.isPackaged)
    // 注册更新服务
    updateElectronApp({ notifyUser: false })

function createWindow() {
    const config = {
        show: false,
        width: 1280,
        height: 720,
        center: true,
        icon: assets.icon,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, 'preload.cjs'),
        },
    }

    // 创建浏览器窗口
    const mainWindow = new BrowserWindow(config)
    const webContents = mainWindow.webContents

    // 隐藏菜单栏
    mainWindow.setMenu(null)

    // 控制台
    const devTools = (function () {
        if (this.isDevToolsOpened())
            this.closeDevTools()
        this.openDevTools({ mode: 'detach' })
    }).bind(webContents)

    // 网页加载完成后，执行渲染器脚本
    webContents.on('dom-ready', () => {
        fs.readFile(path.resolve(__dirname, 'renderer.js'), 'utf-8', (err, data) => {
            if (err) throw err
            webContents.executeJavaScript(data).then(() => webContents.send('apply-settings'))
        })
    })

    // 加载 index.html
    mainWindow.loadFile(path.resolve(__dirname, 'index.html'))

    // 壁纸注册相关
    function attachWallpaper() {
        wallpaper = true
        mainWindow.flashFrame(false)
        mainWindow.setFullScreen(true)
        attach(mainWindow, {
            transparent: true,
            forwardMouseInput: false,
            forwardKeyboardInput: false,
        })
    }

    function detachWallpaper() {
        wallpaper = false
        mainWindow.flashFrame(true)
        mainWindow.setFullScreen(false)
        detach(mainWindow)
        reset()
    }

    // 设置
    function settings() {
        if (settingsWindow) {
            settingsWindow.focus()
        } else {
            settingsWindow = createSettingsWindow()
            settingsWindow.once('closed', () => {
                webContents.reload()
                settingsWindow = null
            })
        }
    }

    // 退出
    function exit() {
        if (settingsWindow)
            settingsWindow.close()
        mainWindow.hide()
        if (wallpaper)
            detachWallpaper()
        mainWindow.close()
    }

    // 系统托盘菜单
    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'DevTools',
            click: devTools,
        },
        {
            label: '切换壁纸状态',
            click: () => wallpaper
                ? detachWallpaper()
                : attachWallpaper()
        },
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

    // 注册壁纸
    attachWallpaper()

    return mainWindow
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    // new Notification({
    //     title: app.name,
    //     body: `Running on ${process.platform} ${os.release()}`,
    // }).show()

    // 检查操作系统
    if (process.platform !== 'win32') {
        dialog.showErrorBox(app.getName(), 'Sorry, this app only works properly on Windows.')
        app.quit()
    }

    // 检查单实例锁
    const lock = app.requestSingleInstanceLock()

    // 如果锁定失败，则退出应用
    if (!lock) {
        app.quit()
    } else {
        // 注册 IPC 通信
        initIPC()

        // 创建浏览器窗口
        const mainWindow = createWindow()
        mainWindow.once('ready-to-show', () => {
            // 显示窗口
            mainWindow.show()
        })

        // 当运行第二个实例时，将会聚焦到这个窗口
        app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore()
                mainWindow.focus()
            }
        })

        // 设置开机自启
        if (app.isPackaged) {
            const appEntry = path.resolve(path.dirname(app.getPath('exe')), '..', `${app.getName()}.exe`)
            if (fs.existsSync(appEntry)) {
                app.setLoginItemSettings({
                    openAtLogin: true,
                    path: appEntry
                })
            } else {
                dialog.showErrorBox(app.getName(), `Failed to set auto-start.\n\n${appEntry}`)
            }
        }
    }
})

// 在程序退出前，重置壁纸
app.on('will-quit', reset)

// 当所有窗口被关闭时退出应用
app.on('window-all-closed', app.quit)

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。