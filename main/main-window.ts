import { join } from "path";
import isDev from "electron-is-dev";
import { app, BrowserWindow, shell } from "electron";

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;

export function create() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            webSecurity: isDev ? false : true, // Disabled in deb mode because of vite
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, "preload.js"),
        },
        icon: "/Users/karim/perso/projects/moubah/renderer/assets/icons/512x512.png",
        show: false,
    });

    // create a new `splash`-Window
    splashWindow = new BrowserWindow({
        width: 500,
        height: 300,
        show: false,
        frame: false,
        alwaysOnTop: true,
        // backgroundColor: "#312450",
    });

    // const image = nativeImage.createFromPath(
    //     "/Users/karim/perso/projects/moubah/electron-build-resources/icon.icns"
    // );
    // app.dock.setIcon(image);

    if (isDev) {
        const port = process.env.PORT || 3000;
        splashWindow.loadURL(`http://localhost:${port}/splash/`);
    } else {
        splashWindow.loadURL(
            join(app.getAppPath(), "renderer/out/splash/index.html")
        );
    }
    // if main window is ready to show, then destroy the splash window and show up the main window
    splashWindow.once("ready-to-show", () => {
        // splashWindow.destroy();
        splashWindow.show();
    });

    // and load the index.html of the app.
    if (isDev) {
        const port = process.env.PORT || 3000;
        mainWindow.loadURL(`http://localhost:${port}`);
    } else {
        mainWindow.loadFile(
            join(app.getAppPath(), "renderer", "out", "index.html")
        );
    }

    // Open URLs from anchor with target="_blank" in a navigator, not in the Electon app
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    // if main window is ready to show, then destroy the splash window and show up the main window
    mainWindow.once("ready-to-show", () => {
        splashWindow.destroy();
        mainWindow.show();
    });

    return mainWindow;
}

export function get() {
    return mainWindow;
}

export function toogleDevTools() {
    mainWindow.webContents.toggleDevTools();
}
