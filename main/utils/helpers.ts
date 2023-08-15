import sanitize from "sanitize-filename";
import { shell } from "electron";
import crypto from "crypto";
import fs from "fs";
import { LOGS_DIR_PATH } from "./const";
import { VideoQuality } from "./enum";

export function createPathIfDoesntExists(path: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

export function openLogsInFileExplorer() {
    openFileExplorer(LOGS_DIR_PATH);
}

export function openFileExplorer(path: string) {
    shell.showItemInFolder(path);
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function logStackTrace() {
    try {
        throw new Error("Logging stack trace.");
    } catch (error: any) {
        console.log("Stack trace:", error.stack);
    }
}

export function hash(data: string) {
    return crypto.createHash("sha1").update(data).digest("base64");
}

export function sanitizeText(text: string) {
    return sanitize(text.replace(/['%]/g, ""));
}

export function sortQuality(
    qualities: VideoQuality[],
    asc: boolean = true
): VideoQuality[] {
    return qualities
        .map((q) => parseInt(q.replace("p", "")))
        .sort((a, b) => (asc ? a - b : b - a))
        .map((n) => convertStringToEnum(VideoQuality, n + "p"))
        .filter((quality): quality is VideoQuality => quality !== undefined);
}

export function resForQuality(quality: VideoQuality): number {
    return parseInt(quality.replace("p", ""));
}

export function convertStringToEnum<T extends string>(
    enumType: Record<string, T>,
    value: string
): T | undefined {
    const enumValues = Object.values(enumType) as string[];
    if (enumValues.includes(value)) {
        return value as T;
    }
    return undefined;
}
