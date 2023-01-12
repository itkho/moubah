import { spawn } from "child_process";
import path from "path";
import {
    FFMPEG_BIN_DIR,
    FFPROBE_BIN_DIR,
    TEMP_PATH,
    PATH_SEPARATOR,
} from "../const";
import fs from "fs";
import { logSpawn, mainLogger } from "../logger";

export function extractAudioFromVideo(videoPath: string, audioPath: string) {
    return new Promise<void>((resolve, _reject) => {
        const result = spawn(
            "ffmpeg",
            ["-i", videoPath, "-q:a", "0", "-map", "a", audioPath, "-y"],
            {
                env: {
                    PATH: `${FFMPEG_BIN_DIR}${PATH_SEPARATOR}${FFPROBE_BIN_DIR}`,
                },
            }
        );

        logSpawn(result, mainLogger, "FFmpeg extractAudioFromVideo");

        result.on("close", (_code) => {
            resolve();
        });
    });
}

export function convertAudioToMono(audioPath: string) {
    return new Promise<void>((resolve, _reject) => {
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

        logSpawn(result, mainLogger, "FFmpeg convertAudioToMono");

        result.on("close", (_code) => {
            // fs.rmSync(audioPath, { force: true });
            fs.renameSync(audioPath, `${audioPath}.old`);
            fs.renameSync(tmpAudioPath, audioPath);
            resolve();
        });
    });
}

export function split(
    filePath: string,
    outputPath: string,
    outputFormat = "chunk_%03d.wav"
) {
    // TODO: raise an error if there is more than 999 chunks
    return new Promise<void>((resolve, _reject) => {
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

        logSpawn(result, mainLogger, "FFmpeg split");

        result.on("close", (_code) => {
            resolve();
        });
    });
}

export function merge(audioListFile: string, outputPath: string) {
    return new Promise<void>((resolve, _reject) => {
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

        logSpawn(result, mainLogger, "FFmpeg merge");

        result.on("close", (_code) => {
            resolve();
        });
    });
}

export function addAudioToVideo(audioPath: string, videoPath: string) {
    return new Promise<void>((resolve, _reject) => {
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

        logSpawn(result, mainLogger, "FFmpeg addAudioToVideo");

        result.on("close", (_code) => {
            // fs.rmSync(videoPath);
            fs.renameSync(tmpVideoPath, videoPath);
            resolve();
        });
    });
}
