import { join, dirname } from "path";
import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { platform, arch } from "os";

export let OS: "win" | "mac";
switch (platform()) {
    case "win32":
        OS = "win";
        break;
    case "darwin":
        OS = "mac";
        break;
    default:
        throw `This OS (${platform()}) isn't supported yet`;
}
export const IS_APPLE_SILICON = OS == "mac" && arch() == "arm64";
export const PATH_SEPARATOR = OS == "win" ? ";" : ":";
export const DIR_SEPARATOR = OS == "win" ? "\\" : "/";
export const EXEC_EXTENSION = OS == "win" ? ".exe" : "/";

export const CONFIG_PATH = join(app.getAppPath(), "config.json");
export const MUSIC_REMOVER_DIR = join(app.getAppPath(), "music-remover");
export const MUSIC_REMOVER_EXE_DIR = join(MUSIC_REMOVER_DIR, "dist");
export const PYTHON_DIR = join(MUSIC_REMOVER_DIR, ".venv", "bin");
export const FFMPEG_BIN_DIR = dirname(require("ffmpeg-static"));
export const FFPROBE_BIN_DIR = dirname(require("ffprobe-static").path);

export const LOGS_DIR_PATH = join(app.getPath("logs"));
export const STORAGE_DIR_PATH = join(app.getPath("videos"), "Moubah");
if (!existsSync(STORAGE_DIR_PATH)) {
    mkdirSync(STORAGE_DIR_PATH);
}

// export const TEMP_PATH = path.join(app.getPath("temp"), "Moubah")
export const TEMP_PATH = join(app.getPath("videos"), "Moubah-tmp");
if (!existsSync(TEMP_PATH)) {
    mkdirSync(TEMP_PATH);
}
