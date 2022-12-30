const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const { AUDIO_CHUNK_QUEUE_HIGH } = require("../const");
const { VideoStatus } = require("../enum");
const FFmpeg = require("../lib/ffmpeg");
const VideoModel = require("../model/video");
const VideoRepository = require("../repository/video");
const ChunkRequestDTO = require("../../dto/chunk-request");
const { pushToQueue } = require("../queue");

// TODO: inherit from AbstractInstanceService
// TODO: add child YtVideoService for logic specific to Yt (to facilitate the futur implementation of FileVideoService)
class VideoService {
    constructor(video) {
        this.video = video;
    }

    static async createFromYtId(videoId) {
        if (!ytdl.validateID(videoId)) {
            console.error(`Youtube ID ${videoId} doesn't exists!`);
            // TODO: add Error objects
            throw `Youtube ID ${videoId} doesn't exists!`;
        }

        const info = await ytdl.getBasicInfo(videoId);
        const video = new VideoModel({
            id: videoId,
            title: info.videoDetails.title,
            thumbnailUri: info.videoDetails.thumbnails[0].url,
        });
        VideoRepository.save(video);
        return new VideoService(video);
    }

    async download() {
        // TODO: add download progress (should be possible according to the doc)
        // https://www.npmjs.com/package/ytdl-core#:~:text=format%20to%20download.-,Event%3A%20progress,-number%20%2D%20Chunk%20length
        this.setStatus(VideoStatus.downloading);
        console.log("Donwloading...");
        await this.#downloadVideo();
        console.log(`Video downloaded: ${fs.existsSync(this.video.path)}`);
        await this.#downloadAudioChunks();
        console.log(
            `Audio downloaded: ${fs.existsSync(this.video.audio.path)}`
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
        return new Promise((resolve, reject) => {
            writerStream.on("finish", resolve);
        });
    }

    async #downloadAudioChunks() {
        // TODO: use tmp directory
        const writerStream = fs.createWriteStream(this.video.audio.path);
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
        return new Promise((resolve, reject) => {
            writerStream.on("finish", () => {
                console.log("Download audio finished");
                FFmpeg.convertAudioToMono(this.video.audio.path);
                FFmpeg.split(this.video.audio.path, this.video.chunksTodoDir);
                resolve();
            });
        });
    }

    sendAudioChunksTodo() {
        console.log("Processing...");
        this.setStatus(VideoStatus.processing);
        this.video.audioChunksTodo.forEach((audio) => {
            const chunkRequestDTO = new ChunkRequestDTO({
                input_path: audio.path,
                output_path: path.join(
                    this.video.chunksDoneDir,
                    path.basename(audio.path)
                ),
                remove_original: true,
            });
            pushToQueue(AUDIO_CHUNK_QUEUE_HIGH, chunkRequestDTO);
        });
    }

    addAudioFromChunksDone() {
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
        FFmpeg.merge(
            audioListFile,
            path.join(this.video.dir, "audio_wo_music.wav")
        );
        FFmpeg.addAudioToVideo(
            path.join(this.video.dir, "audio_wo_music.wav"),
            this.video.path
        );
        this.removeChunks();
        this.setStatus(VideoStatus.done);
    }

    removeChunks() {
        fs.rmSync(this.video.chunksDir, { recursive: true, force: true });
    }

    setStatus(status) {
        this.video.status = status;
        VideoRepository.save(this.video);
    }
}

module.exports = VideoService;
