import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";
import { STORAGE_DIR_PATH } from "../const";
import { QueueName, VideoStatus } from "../enum";
import {
    addAudioToVideo,
    convertAudioToMono,
    merge,
    split,
} from "../lib/ffmpeg";
import VideoModel from "../model/video";
import { save } from "../repository/video";
import ChunkRequestDTO from "../../dto/chunk-request";
import { pushToQueue } from "../queue";
import { mainLogger } from "../logger";

// TODO: inherit from AbstractInstanceService
// TODO: add child YtVideoService for logic specific to Yt (to facilitate the futur implementation of FileVideoService)
export default class VideoService {
    video: VideoModel;

    constructor(video: VideoModel) {
        this.video = video;
    }

    static async createFromYtId(videoId: string) {
        if (!ytdl.validateID(videoId)) {
            mainLogger.error(`Youtube ID ${videoId} doesn't exists!`);
            // TODO: add Error objects
            throw `Youtube ID ${videoId} doesn't exists!`;
        }

        const info = await ytdl.getBasicInfo(videoId);
        const video = new VideoModel(
            videoId,
            info.videoDetails.title,
            info.videoDetails.thumbnails[0].url
        );
        save(video);
        return new VideoService(video);
    }

    async download() {
        // TODO: add download progress (should be possible according to the doc)
        // https://www.npmjs.com/package/ytdl-core#:~:text=format%20to%20download.-,Event%3A%20progress,-number%20%2D%20Chunk%20length
        this.setStatus(VideoStatus.downloading);
        mainLogger.info("Donwloading...");
        await this.#downloadVideo();
        mainLogger.info(`Video downloaded: ${fs.existsSync(this.video.path)}`);
        await this.#downloadAudioChunks();
        mainLogger.info(
            `Audio downloaded: ${fs.existsSync(this.video.audioPath)}`
        );
        this.sendAudioChunksTodo();
    }

    async #downloadVideo() {
        const writerStream = fs.createWriteStream(this.video.path);
        ytdl(this.video.id, {
            filter: (format) => {
                return (
                    format.container === "mp4" &&
                    format.hasVideo === true &&
                    format.hasAudio === false
                );
            },
        }).pipe(writerStream);
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
            this.video.path
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
        this.video.status = status;
        save(this.video);
    }
}
