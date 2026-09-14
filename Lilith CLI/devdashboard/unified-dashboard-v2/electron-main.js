const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow = null;
let serverProcess = null;

const isDev = process.env.NODE_ENV === 'development';
const PORT = 3000;

function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'server.ts');
    serverProcess = spawn('npx', ['tsx', serverPath], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'production' },
    });

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[server]', output.trim());
      if (output.includes('http://0.0.0.0:3000') || output.includes('Dashboard')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('[server:err]', data.toString().trim());
    });

    serverProcess.on('error', reject);
    serverProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Server exited with code ${code}`);
      }
    });

    // Fallback: wait 3s then resolve anyway
    setTimeout(resolve, 3000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'Void — Lilith Sovereign Fleet',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
