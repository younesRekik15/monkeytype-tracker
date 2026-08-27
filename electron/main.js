const { spawn } = require('node:child_process')
const path = require('node:path')
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow(
        {
            width: 815,
            height: 110,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            resizable: false,
            skipTaskbar: true
        })
    win.loadURL('http://localhost:5173')
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
