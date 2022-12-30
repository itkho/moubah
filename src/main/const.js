const path = require("path");
const { app } = require('electron');
const fs = require("fs");
const os = require("os");

// Warning: IS_DEV works, but not IS_PROD (maybe because there is no process.env in production 🤷)
// Warning for Windows: "NODE_ENV=development" in the package.json dones't work, you have to use "set NODE_ENV=development"
// TODO: use dotenv for this instead
const IS_DEV = process.env.NODE_ENV === "development";
// const IS_DEV = true;

let OS;
switch (os.platform()) {
    case "win32":
        OS = "win";
        break;
    case "darwin":
        OS = "mac";
        break;
    default:
        throw `This OS (${os.platform()}) isn't supported yet`
}
const IS_APPLE_SILICON = OS == "mac" && os.arch() == "arm64";
const PATH_SEPARATOR = OS == "win" ? ";" : ":";
const DIR_SEPARATOR = OS == "win" ? "\\" : "/";
const EXEC_EXTENSION = OS == "win" ? ".exe" : "/";

const AUDIO_CHUNK_QUEUE_HIGH = "audio-chunk:todo:priority-high";
const AUDIO_CHUNK_QUEUE_LOW = "audio-chunk:todo:priority-low";

console.log(app.getAppPath());
const MUSIC_REMOVER_DIR = path.join(app.getAppPath(), "music-remover");
const PYTHON_DIR = path.join(MUSIC_REMOVER_DIR, ".venv", "bin", "python");
const RESOURCE_DIR = "TODO";
const FFMPEG_BIN_DIR = path.dirname(require('ffmpeg-static'));
const FFPROBE_BIN_DIR = path.dirname(require('ffprobe-static').path);

const STORAGE_DIR_PATH = path.join(app.getPath("videos"), "Moubah")
if (!fs.existsSync(STORAGE_DIR_PATH)) {
    fs.mkdirSync(STORAGE_DIR_PATH);
}

// const TEMP_PATH = path.join(app.getPath("temp"), "Moubah")
const TEMP_PATH = path.join(app.getPath("videos"), "Moubah-tmp")
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
    STORAGE_DIR_PATH,
    TEMP_PATH,
    MUSIC_REMOVER_DIR,
    PYTHON_DIR,
    RESOURCE_DIR,
    FFMPEG_BIN_DIR,
    FFPROBE_BIN_DIR,
    AUDIO_CHUNK_QUEUE_HIGH,
    AUDIO_CHUNK_QUEUE_LOW,
}