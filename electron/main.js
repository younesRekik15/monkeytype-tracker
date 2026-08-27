const { spawn } = require('node:child_process')
const path = require('node:path')
const { app, BrowserWindow, screen } = require('electron')

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
    win.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
}

app.whenReady().then(() => { 
    
    const backendProcess = spawn('node', [
    '--env-file=' + path.join(__dirname, '..', '.env'),
    'index.js'
    ], {
    cwd: path.join(__dirname, '..', 'back'),
    stdio: 'inherit'
    })
    createWindow()
})
