import { join } from "path";
import isDev from "electron-is-dev";
import { app, BrowserWindow, shell } from "electron";

let mainWindow: BrowserWindow;

export function create() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            webSecurity: isDev ? false : true, // TODO: only needed on dev mode??
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, "preload.js"),
        },
    });

    // and load the index.html of the app.
    if (isDev) {
        const port = process.env.PORT || 3000;
        mainWindow?.loadURL(`http://localhost:${port}`);
    } else {
        mainWindow?.loadFile(join(app.getAppPath(), "renderer/out/index.html"));
    }

    // Open URLs from anchor with target="_blank" in a navigator, not in the Electon app
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    return mainWindow;
}

export function get() {
    return mainWindow;
}

export function toogleDevTools() {
    mainWindow.webContents.toggleDevTools();
}
