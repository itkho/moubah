import { shell } from "electron";
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
