const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true, // Set the window to full-screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Allows node modules to be required in React
      contextIsolation: false, // Allows access to Electron APIs in React
    },
  });

  // Load your React app
  mainWindow.loadURL(`http://localhost:3000`); // For development
  // mainWindow.loadFile('path/to/index.html'); // For production after build
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
