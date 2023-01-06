const { BrowserWindow, shell } = require("electron");
const path = require("path");

const { IS_DEV } = require("./main/const");

let mainWindow;

function create() {
    mainWindow = new BrowserWindow({
        width: IS_DEV ? 1300 : 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // Open URLs for anchor with target="_blank" in a navigator (not in Electon)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
    return mainWindow;
}

function get() {
    return mainWindow;
}

function toogleDevTools() {
    mainWindow.webContents.toggleDevTools();
}

module.exports = {
    createMainWindow: create,
    getMainWindow: get,
    toogleDevTools,
};
