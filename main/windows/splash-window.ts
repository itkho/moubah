import { join } from "path";
import isDev from "electron-is-dev";
import { app, BrowserWindow } from "electron";

let splashWindow: BrowserWindow;

export function create() {
    splashWindow = new BrowserWindow({
        width: 500,
        height: 300,
        show: false,
        frame: false,
    });

    if (isDev) {
        const port = process.env.PORT || 3000;
        splashWindow.loadURL(`http://localhost:${port}/splash/`);
    } else {
        splashWindow.loadURL(
            join(app.getAppPath(), "renderer", "out", "splash", "index.html")
        );
    }

    splashWindow.once("ready-to-show", () => {
        splashWindow.show();
    });

    return splashWindow;
}

export function get() {
    return splashWindow;
}
