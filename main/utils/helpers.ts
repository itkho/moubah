import { shell } from "electron";
import crypto from "crypto";
import fs from "fs";
import { LOGS_DIR_PATH } from "./const";

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
