const { spawn } = require("child_process");
const path = require("path");
const {
    FFMPEG_BIN_DIR,
    FFPROBE_BIN_DIR,
    TEMP_PATH,
    PATH_SEPARATOR,
} = require("../const");
var fs = require("fs");
const { mainLogger } = require("../logger");
const { logSpawn } = require("../helpers");

class FFmpeg {
    constructor() {
        throw new TypeError("Cannot construct FFmpeg instances directly");
    }

    static split(filePath, outputPath, outputFormat = "chunk_%03d.wav") {
        // TODO: raise an error if there is more than 999 chunks
        return new Promise((resolve, reject) => {
            const result = spawn(
                "ffmpeg",
                [
                    "-i",
                    filePath,
                    "-c",
                    "copy",
                    "-map",
                    "0",
                    "-segment_time",
                    "00:00:10",
                    "-f",
                    "segment",
                    "-reset_timestamps",
                    "1",
                    `${outputPath}/${outputFormat}`,
                ],
                {
                    env: {
                        PATH: `${FFMPEG_BIN_DIR}${PATH_SEPARATOR}${FFPROBE_BIN_DIR}`,
                    },
                }
            );

            logSpawn(result, mainLogger.debug, "FFmpeg split");

            result.on("close", (code) => {
                resolve();
            });
        });
    }

    static convertAudioToMono(audioPath) {
        return new Promise((resolve, reject) => {
            const tmpAudioPath = path.join(TEMP_PATH, "audio.mp3");
            const result = spawn(
                "ffmpeg",
                ["-i", audioPath, "-ac", "1", tmpAudioPath, "-y"],
                {
                    env: {
                        PATH: `${FFMPEG_BIN_DIR}${PATH_SEPARATOR}${FFPROBE_BIN_DIR}`,
                    },
                }
            );

            logSpawn(result, mainLogger.debug, "FFmpeg convertAudioToMono");

            result.on("close", (code) => {
                // fs.rmSync(audioPath, { force: true });
                fs.renameSync(audioPath, `${audioPath}.old`);
                fs.renameSync(tmpAudioPath, audioPath);
                resolve();
            });
        });
    }

    static extractAudioFromVideo(videoPath, audioPath) {
        return new Promise((resolve, reject) => {
            const result = spawn(
                "ffmpeg",
                ["-i", videoPath, "-q:a", "0", "-map", "a", audioPath, "-y"],
                {
                    env: {
                        PATH: `${FFMPEG_BIN_DIR}${PATH_SEPARATOR}${FFPROBE_BIN_DIR}`,
                    },
                }
            );

            logSpawn(result, mainLogger.debug, "FFmpeg extractAudioFromVideo");

            result.on("close", (code) => {
                resolve();
            });
        });
    }

    static merge(audioListFile, outputPath) {
        return new Promise((resolve, reject) => {
            const result = spawn(
                "ffmpeg",
                [
                    "-f",
                    "concat",
                    "-safe",
                    "0",
                    "-i",
                    audioListFile,
                    "-c",
                    "copy",
                    outputPath,
                    "-y",
                ],
                {
                    env: {
                        PATH: `${FFMPEG_BIN_DIR}${PATH_SEPARATOR}${FFPROBE_BIN_DIR}`,
                    },
                }
            );

            logSpawn(result, mainLogger.debug, "FFmpeg merge");

            result.on("close", (code) => {
                resolve();
            });
        });
    }

    static addAudioToVideo(audioPath, videoPath) {
        return new Promise((resolve, reject) => {
            const tmpVideoPath = path.join(TEMP_PATH, "video.mp4");
            const result = spawn(
                "ffmpeg",
                [
                    "-i",
                    videoPath,
                    "-i",
                    audioPath,
                    "-map",
                    "0:0",
                    "-map",
                    "1:0",
                    "-c:v",
                    "copy",
                    tmpVideoPath,
                    "-y",
                ],
                {
                    env: {
                        PATH: `${FFMPEG_BIN_DIR}${PATH_SEPARATOR}${FFPROBE_BIN_DIR}`,
                    },
                }
            );

            logSpawn(result, mainLogger.debug, "FFmpeg addAudioToVideo");

            result.on("close", (code) => {
                // fs.rmSync(videoPath);
                fs.renameSync(tmpVideoPath, videoPath);
                resolve();
            });
        });
    }
}

module.exports = FFmpeg;
