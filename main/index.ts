import { BrowserWindow, app } from "electron";
import { create as createMainWindow } from "./main-window";
import { setUp, tearDown } from "./setup";

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createMainWindow);

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
    app.quit();
}

app.on("before-quit", tearDown);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
setUp();
