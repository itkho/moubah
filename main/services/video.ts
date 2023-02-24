import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";
import { STORAGE_DIR_PATH } from "../utils/const";
import { QueueName, VideoStatus } from "../utils/enum";
import {
    addAudioToVideo,
    convertAudioToMono,
    merge,
    split,
} from "../lib/ffmpeg";
import VideoModel from "../model/video";
import { save } from "../repository/video";
import ChunkRequestDTO from "../dto/chunk-request";
import { pushToQueue } from "../lib/queue";
import { mainLogger } from "../utils/logger";
import VideoDTO from "../dto/video";

// TODO: inherit from AbstractInstanceService
// TODO: add child YtVideoService for logic specific to Yt (to facilitate the futur implementation of FileVideoService)
export default class VideoService {
    video: VideoModel;

    constructor(video: VideoModel) {
        this.video = video;
    }

    static async createFromYt(videoYt: VideoDTO) {
        if (!ytdl.validateID(videoYt.id)) {
            // TODO: check if we can keep the "throw" only
            mainLogger.error(`Youtube ID ${videoYt.id} doesn't exists!`);
            throw Error(`Youtube ID ${videoYt.id} doesn't exists!`);
        }
        const video = VideoModel.fromDTO(videoYt);
        save(video);
        return new VideoService(video);
    }

    async download() {
        mainLogger.info("Donwloading...");
        this.setStatus(VideoStatus.downloading);
        await this.#downloadVideo();
        mainLogger.info(
            `Video downloaded: ${fs.existsSync(this.video.videoPath)}`
        );
        await this.#downloadAudioChunks();
        mainLogger.info(
            `Audio downloaded: ${fs.existsSync(this.video.audioPath)}`
        );
        this.sendAudioChunksTodo();
    }

    async #downloadVideo() {
        const writerStream = fs.createWriteStream(this.video.videoPath);
        ytdl(this.video.id, {
            filter: (format) => {
                return (
                    format.container === "mp4" &&
                    format.hasVideo === true &&
                    format.hasAudio === false
                );
            },
        })
            .on("progress", (_, totalDownloaded, total) => {
                const progress = Math.floor((totalDownloaded / total) * 100);
                if (progress != this.video.progress) {
                    this.video.downloadingProgress = progress;
                    save(this.video);
                }
            })
            .pipe(writerStream);
        return new Promise((resolve, _reject) => {
            writerStream.on("finish", resolve);
        });
    }

    async #downloadAudioChunks() {
        // TODO: use tmp directory
        const writerStream = fs.createWriteStream(this.video.audioPath);
        ytdl(this.video.id, {
            filter: (format) => {
                return (
                    format.container === "mp4" &&
                    format.hasVideo === false &&
                    format.hasAudio === true
                    // TODO:
                    // && format.audioQuality === "AUDIO_QUALITY_LOW"
                );
            },
        }).pipe(writerStream);
        return new Promise<void>((resolve, _reject) => {
            writerStream.on("finish", async () => {
                mainLogger.info("Download audio finished");
                await convertAudioToMono(this.video.audioPath);
                await split(this.video.audioPath, this.video.chunksTodoDir);
                resolve();
            });
        });
    }

    sendAudioChunksTodo() {
        mainLogger.info("Processing...");
        this.setStatus(VideoStatus.processing);
        this.video.audioChunksTodo.forEach((audio) => {
            const chunkRequestDTO = new ChunkRequestDTO(
                audio.path,
                path.join(this.video.chunksDoneDir, path.basename(audio.path)),
                true
            );
            pushToQueue(QueueName.HighPriorityAudioChunks, chunkRequestDTO);
        });
    }

    async processChunksDone() {
        await this.addAudioFromChunksDone();
        this.removeChunks();
        this.removeAudiosOnly();
        this.setStatus(VideoStatus.done);
    }

    async addAudioFromChunksDone() {
        const audioListFile = path.join(
            this.video.chunksDoneDir,
            "audioListFile.txt"
        );
        fs.writeFileSync(
            audioListFile,
            fs
                .readdirSync(this.video.chunksDoneDir)
                .filter((file) => file.match(/^chunk_(\d){3}.wav$/g))
                .map(
                    (file) =>
                        `file '${path.join(this.video.chunksDoneDir, file)}'`
                )
                .join("\n")
        );
        mainLogger.debug(
            `File ${audioListFile} created: ${
                fs.existsSync(STORAGE_DIR_PATH) ? "✅" : "❌"
            }`
        );
        mainLogger.debug(`File created: ${audioListFile}`);
        await merge(
            audioListFile,
            path.join(this.video.dir, "audio_wo_music.wav")
        );
        mainLogger.debug(
            `Audio file ${audioListFile} created: ${
                path.join(this.video.dir, "audio_wo_music.wav") ? "✅" : "❌"
            }`
        );
        await addAudioToVideo(
            path.join(this.video.dir, "audio_wo_music.wav"),
            this.video.videoPath
        );
    }

    removeChunks() {
        if (!this.video.chunksDir.includes(STORAGE_DIR_PATH))
            throw "Cannot remove this folder (out of access scope)";
        fs.rmSync(this.video.chunksDir, { recursive: true, force: true });
    }

    removeAudiosOnly() {
        fs.rmSync(path.join(this.video.dir, "audio_wo_music.wav"));
        fs.rmSync(this.video.audioPath);
    }

    setStatus(status: VideoStatus) {
        mainLogger.debug(`setStatus ${status} on ${this.video.id}`);
        this.video.status = status;
        save(this.video);
    }
}
