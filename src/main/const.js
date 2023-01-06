const path = require("path");
const { app } = require("electron");
const fs = require("fs");
const os = require("os");

const IS_DEV = process.env.NODE_ENV === "development";

let OS;
switch (os.platform()) {
    case "win32":
        OS = "win";
        break;
    case "darwin":
        OS = "mac";
        break;
    default:
        throw `This OS (${os.platform()}) isn't supported yet`;
}
const IS_APPLE_SILICON = OS == "mac" && os.arch() == "arm64";
const PATH_SEPARATOR = OS == "win" ? ";" : ":";
const DIR_SEPARATOR = OS == "win" ? "\\" : "/";
const EXEC_EXTENSION = OS == "win" ? ".exe" : "/";

const AUDIO_CHUNK_QUEUE_HIGH = "audio-chunk:todo:priority-high";
const AUDIO_CHUNK_QUEUE_LOW = "audio-chunk:todo:priority-low";

const CONFIG_PATH = path.join(app.getAppPath(), "config.json");
const MUSIC_REMOVER_DIR = path.join(app.getAppPath(), "music-remover");
const PYTHON_DIR = path.join(MUSIC_REMOVER_DIR, ".venv", "bin");
const RESOURCE_DIR = "TODO";
const FFMPEG_BIN_DIR = path.dirname(require("ffmpeg-static"));
const FFPROBE_BIN_DIR = path.dirname(require("ffprobe-static").path);

const LOGS_DIR_PATH = path.join(app.getPath("logs"));
const STORAGE_DIR_PATH = path.join(app.getPath("videos"), "Moubah");
if (!fs.existsSync(STORAGE_DIR_PATH)) {
    fs.mkdirSync(STORAGE_DIR_PATH);
}

// const TEMP_PATH = path.join(app.getPath("temp"), "Moubah")
const TEMP_PATH = path.join(app.getPath("videos"), "Moubah-tmp");
if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH);
}

module.exports = {
    IS_DEV,
    OS,
    PATH_SEPARATOR,
    DIR_SEPARATOR,
    EXEC_EXTENSION,
    IS_APPLE_SILICON,
    LOGS_DIR_PATH,
    STORAGE_DIR_PATH,
    TEMP_PATH,
    CONFIG_PATH,
    MUSIC_REMOVER_DIR,
    PYTHON_DIR,
    RESOURCE_DIR,
    FFMPEG_BIN_DIR,
    FFPROBE_BIN_DIR,
    AUDIO_CHUNK_QUEUE_HIGH,
    AUDIO_CHUNK_QUEUE_LOW,
};
