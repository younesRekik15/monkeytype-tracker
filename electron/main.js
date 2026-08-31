const { spawn } = require('node:child_process')
const path = require('node:path')
const { app, BrowserWindow, screen } = require('electron')

const isPackaged = app.isPackaged
const isDevelopment = !isPackaged && process.argv.includes('--dev')
const basePath = isPackaged ? process.resourcesPath : path.join(__dirname, '..')
const backendPath = isPackaged
  ? path.join(process.resourcesPath, 'back')
  : path.join(basePath, 'back')

let backendProcess

const createWindow = () => {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize
  const margin = 20

  const win = new BrowserWindow({
    width: 815,
    height: 145,
    x: screenWidth - 815 - margin,
    y: margin,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
  })

  if (isDevelopment) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(basePath, 'frontend', 'dist', 'index.html'))
  }
}

const getEnvPath = () => {
  return path.join(basePath, '.env')
}

const startBackend = () => {
  const envPath = getEnvPath()
  const backendScript = path.join(backendPath, 'index.js')

  backendProcess = spawn(
    process.execPath,
    [`--env-file-if-exists=${envPath}`, backendScript],
    {
      cwd: backendPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_PATH: isPackaged
          ? path.join(process.resourcesPath, 'app.asar', 'node_modules')
          : process.env.NODE_PATH,
        CONFIG_FILE_PATH: envPath,
        ELECTRON_RUN_AS_NODE: '1',
      },
    },
  )

  backendProcess.on('error', (error) => {
    console.error('Could not start the backend:', error)
  })
}

app.whenReady().then(() => {
  startBackend()
  createWindow()
})

app.on('before-quit', () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill()
  }
})
