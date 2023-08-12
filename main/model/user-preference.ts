import { v4 as uuid } from "uuid";
// File stored in app.getPath("userData") + settings.json
import settings from "electron-settings";
import { nativeTheme } from "electron";
import { osLocale } from "os-locale-s";
import { VideoQuality } from "../utils/enum";

export function set(key: string, value: any) {
    settings.setSync(key, value);
}

export function get(key: string) {
    switch (key) {
        case "darkMode":
            return getDarkMode();
        case "quality":
            return getQuality();
        case "lang":
            return getLang();
        default:
            return settings.getSync(key);
    }
}

export function getLang(): string {
    const lang = settings.getSync("lang");
    if (typeof lang === "string") {
        return lang;
    }
    return osLocale.sync().split("-")[0];
}

export function getUserId(): string {
    let userId = settings.getSync("userId");
    if (typeof userId !== "string") {
        userId = uuid();
        settings.setSync("userId", userId);
    }
    return userId;
}

function getDarkMode(): boolean {
    const darkModePref = settings.getSync("darkMode");
    if (typeof darkModePref === "boolean") {
        return darkModePref;
    }
    return nativeTheme.shouldUseDarkColors;
}

function getQuality(): VideoQuality {
    const quality = settings.getSync("quality");
    if (
        typeof quality === "string" &&
        Object.values(VideoQuality).includes(quality as VideoQuality)
    ) {
        return quality as VideoQuality;
    }
    return VideoQuality.p720;
}

export function getLastMessageSeenTimestamp() {
    let timestamp: any = settings.getSync("lastMessagesSeenTimestamp");
    if (timestamp === undefined || timestamp === null) return;
    return timestamp as number;
}

export function setLastMessageSeenTimestamp(timestamp: number) {
    const currTimestamp = getLastMessageSeenTimestamp();
    if (currTimestamp && timestamp <= currTimestamp) return;
    settings.setSync("lastMessagesSeenTimestamp", timestamp);
}
