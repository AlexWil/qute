const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

function createWindow () {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`,
    );
}

app.on('ready', createWindow);