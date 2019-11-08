const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
import * as path from 'path';

function createWindow () {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`,
    );
}

app.on('ready', createWindow);