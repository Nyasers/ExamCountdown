import { app, BrowserWindow, Tray } from 'electron'
import { updateElectronApp } from 'update-electron-app'
import { attach, detach, reset } from 'electron-as-wallpaper'

const createWindow = () => {
    // 创建浏览器窗口
    const mainWindow = new BrowserWindow({
        menu: null,
        frame: false,
        fullscreen: true,
        transparent: true,
    })

    // 加载 index.html
    mainWindow.loadFile('dist/index.html')

    // 注册壁纸
    attach(mainWindow, {
        transparent: true,
        forwardKeyboardInput: false,
        forwardMouseInput: true,
    })

    // 注册托盘图标
    app.getFileIcon(process.execPath).then((icon) => {
        const tray = new Tray(icon)
        tray.setToolTip('ExamCountdown: 双击退出')
        tray.on('double-click', () => {
            mainWindow.hide()
            detach(mainWindow)
            mainWindow.close()
        })
    })

    // 打开开发工具
    // mainWindow.webContents.openDevTools()

    // 注册更新服务
    updateElectronApp()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    // 检查操作系统
    if (process.platform !== 'win32') {
        alert('Sorry, this app only works properly on Windows.')
        app.quit()
    }

    // 创建浏览器窗口
    createWindow()
})

// 在程序退出前，重置壁纸
app.on('will-quit', reset)

// 当所有窗口被关闭时退出应用
app.on('window-all-closed', app.quit)

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。