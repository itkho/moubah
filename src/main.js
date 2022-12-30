const { app, BrowserWindow } = require('electron');

const { setUp, tearDown } = require('./main/setup');
const { createMainWindow } = require('./main-window');
const { IS_DEV, FFMPEG_BIN_DIR, FFPROBE_BIN_DIR } = require('./main/const');


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
    app.quit();
}

app.on('quit', _ => tearDown());


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
setUp();
console.log(app.getPath("logs"));
