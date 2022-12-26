const path = require("path");
const { app } = require('electron');
const fs = require("fs");


// Warning: IS_DEV works, but not IS_PROD (maybe because there is no process.env in production 🤷)
const IS_DEV = process.env.NODE_ENV === "development";

const AUDIO_CHUNK_QUEUE_HIGH = "audio-chunk:todo:priority-high";
const AUDIO_CHUNK_QUEUE_LOW = "audio-chunk:todo:priority-low";
const AUDIO_CHUNK_DONE_CHANNEL = "audio-chunk:done";

const RESOURCES_DIR = path.join(app.getAppPath(), "resources", "mac")
const BACKEND_BIN_DIR = path.join(RESOURCES_DIR, "backend")
const FFMPEG_BIN_DIR = path.join(RESOURCES_DIR, "ffmpeg");
const REDIS_BIN_DIR = path.join(RESOURCES_DIR, "redis");

const REDIS_PORT = 6379;

const STORAGE_DIR_PATH = path.resolve(app.getPath("videos"), "Moubah")
if (!fs.existsSync(STORAGE_DIR_PATH)) {
    fs.mkdirSync(STORAGE_DIR_PATH);
}

const TEMP_PATH = path.join(app.getPath("temp"), "Moubah")
if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH);
}


module.exports = {
    IS_DEV,
    STORAGE_DIR_PATH,
    TEMP_PATH,
    BACKEND_BIN_DIR,
    FFMPEG_BIN_DIR,
    REDIS_BIN_DIR,
    REDIS_PORT,
    AUDIO_CHUNK_QUEUE_HIGH,
    AUDIO_CHUNK_QUEUE_LOW,
    AUDIO_CHUNK_DONE_CHANNEL,
}