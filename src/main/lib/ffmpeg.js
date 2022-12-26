const { spawnSync } = require("child_process");
const path = require("path");
const { FFMPEG_BIN_DIR, TEMP_PATH, IS_DEV } = require("../const");
var fs = require('fs');


class FFmpeg {
    constructor() {
        throw new TypeError("Cannot construct FFmpeg instances directly");
    }

    static split(filePath, outputPath, outputFormat = "chunk_%03d.wav") {
        const result = spawnSync(
            "ffmpeg",
            [
                "-i", filePath,
                "-c", "copy",
                "-map", "0",
                "-segment_time", "00:00:10",
                "-f", "segment",
                "-reset_timestamps", "1",
                `${outputPath}/${outputFormat}`
            ],
            // TODO: remove all "cwd" (should not be useful)
            { cwd: FFMPEG_BIN_DIR, env: { PATH: FFMPEG_BIN_DIR } }
        )
        if (IS_DEV) {
            console.log(`split stdout: ${result.stdout}`);
            console.error(`split stderr: ${result.stderr}`);
        }
    }

    static convertAudioToMono(audioPath) {
        const tmpAudioPath = path.join(TEMP_PATH, "audio.mp3");
        const result = spawnSync(
            "ffmpeg",
            [
                "-i", audioPath,
                "-ac", "1",
                tmpAudioPath, "-y"
            ],
            { cwd: FFMPEG_BIN_DIR, env: { PATH: FFMPEG_BIN_DIR } }
        )
        if (IS_DEV) {
            console.log(`convertAudioToMono stdout: ${result.stdout}`);
            console.error(`convertAudioToMono stderr: ${result.stderr}`);
        }
        fs.renameSync(tmpAudioPath, audioPath)
    }

    static extractAudioFromVideo(videoPath, audioPath) {
        const result = spawnSync(
            "ffmpeg",
            [
                "-i", videoPath,
                "-q:a", "0",
                "-map", "a",
                audioPath, "-y"
            ],
            { cwd: FFMPEG_BIN_DIR, env: { PATH: FFMPEG_BIN_DIR } }
        )

        if (IS_DEV) {
            console.log(`extractAudioFromVideo stdout: ${result.stdout}`);
            console.error(`extractAudioFromVideo stderr: ${result.stderr}`);
        }
    }

    static merge(audioListFile, outputPath) {
        const result = spawnSync(
            "ffmpeg",
            [
                "-f", "concat",
                "-safe", "0",
                "-i", audioListFile,
                "-c", "copy",
                outputPath, "-y"
            ],
            { cwd: FFMPEG_BIN_DIR, env: { PATH: FFMPEG_BIN_DIR } }
        )
        if (IS_DEV) {
            console.log(`merge stdout: ${result.stdout}`);
            console.error(`merge stderr: ${result.stderr}`);
        }
    }

    static addAudioToVideo(audioPath, videoPath) {
        const tmpVideoPath = path.join(TEMP_PATH, "video.mp4");
        const result = spawnSync(
            "ffmpeg",
            [
                "-i", videoPath,
                "-i", audioPath,
                "-map", "0:0",
                "-map", "1:0",
                "-c:v", "copy",
                tmpVideoPath, "-y"
            ],
            { cwd: FFMPEG_BIN_DIR, env: { PATH: FFMPEG_BIN_DIR } }
        )
        if (IS_DEV) {
            console.log(`addAudioToVideo stdout: ${result.stdout}`);
            console.error(`addAudioToVideo stderr: ${result.stderr}`);
        }
        // fs.rmSync(videoPath);
        fs.renameSync(tmpVideoPath, videoPath)
    }
}

module.exports = FFmpeg