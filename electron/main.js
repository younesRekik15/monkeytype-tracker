const { spawn } = require('node:child_process')
const path = require('node:path')
const { app, BrowserWindow, screen } = require('electron')

const isPackaged = app.isPackaged
const basePath = isPackaged ? process.resourcesPath : path.join(__dirname, '..')

const createWindow = () => {
    const { width:screenWidth, height: screenHeight} = screen.getPrimaryDisplay().workAreaSize
    const margin = 20
    const win = new BrowserWindow(
        {
            width: 815,
            height: 110,
            x: screenWidth - 815 - margin, 
            y: margin,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            resizable: false,
            skipTaskbar: true
            
        })
    win.loadFile(path.join(basePath, 'frontend', 'dist', 'index.html'))
}

app.whenReady().then(() => { 
    
    const backendProcess = spawn('node', [
    '--env-file=' + path.join(basePath, '.env'),
    'index.js'
    ], {
    cwd: path.join(basePath, 'back'),
    stdio: 'inherit'
    })
    createWindow()
})
