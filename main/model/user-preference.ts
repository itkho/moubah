import settings from "electron-settings";
import { nativeTheme } from "electron";

export function set(key: string, value: any) {
    settings.setSync(key, value);
}

export function get(key: string) {
    switch (key) {
        case "darkMode":
            return getDarkMode();
        default:
            return settings.getSync(key);
    }
}

export function getDarkMode(): boolean {
    const darkModePref = settings.getSync("darkMode");
    if (typeof darkModePref === "boolean") {
        return darkModePref;
    }
    return nativeTheme.shouldUseDarkColors;
}
