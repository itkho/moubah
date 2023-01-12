import { join } from "path";
import isDev from "electron-is-dev";
import { BrowserWindow, shell } from "electron";

let mainWindow: BrowserWindow;

export function create() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: join(__dirname, "preload.js"),
        },
    });

    // and load the index.html of the app.
    if (isDev) {
        const port = process.env.PORT || 3000;
        mainWindow?.loadURL(`http://localhost:${port}`);
    } else {
        mainWindow?.loadFile(join(__dirname, "../renderer/out/index.html"));
    }
    // Open URLs for anchor with target="_blank" in a navigator (not in Electon)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    mainWindow.loadFile(join(__dirname, "renderer/index.html"));
    return mainWindow;
}

export function get() {
    return mainWindow;
}

export function toogleDevTools() {
    mainWindow.webContents.toggleDevTools();
}
