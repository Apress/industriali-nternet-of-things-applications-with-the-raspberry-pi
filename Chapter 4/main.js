const electron = require('electron');
const path = require('path');
const url = require('url');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
/* Keep a global reference of the window object, if you don't,
the window will be closed automatically when the JavaScript
object is garbage collected.*/
let mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'UI/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        /* Dereference the window object, usually you would store
        windows in an array if your app supports multi windows,
        this is the time when you should delete the corresponding
        element.*/
        mainWindow = null;
    });
}
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit();
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});