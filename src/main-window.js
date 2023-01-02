const { BrowserWindow, app, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const util = require("util");

const { IS_DEV } = require("./main/const");

let mainWindow;

function create() {
    mainWindow = new BrowserWindow({
        width: IS_DEV ? 1300 : 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (IS_DEV) {
        mainWindow.webContents.openDevTools();
    } else {
        var log_file = fs.createWriteStream(
            path.join(app.getPath("logs"), "main-process.log"),
            { flags: "w" }
        );
        var log_stdout = process.stdout;
        var log_stderr = process.stderr;

        console.log = function (d) {
            log_file.write(util.format(d) + "\n");
            log_stdout.write(util.format(d) + "\n");
        };
        console.error = function (d) {
            log_file.write(util.format(d) + "\n");
            log_stderr.write(util.format(d) + "\n");
        };
    }

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

module.exports = { createMainWindow: create, getMainWindow: get };
