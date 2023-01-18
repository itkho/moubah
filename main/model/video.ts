import path from "path";
import fs from "fs";
import { STORAGE_DIR_PATH } from "../utils/const.js";

import { VideoStatus } from "../utils/enum.js";
import AudioModel from "./audio.js";
import { createPathIfDoesntExists } from "../utils/helpers.js";
import VideoDTO, { Author } from "../dto/video.js";

type Info = {
    title: string;
    timestamp: string;
    views: number;
    author: Author;
    originalThumbnailUri: string;
};

export default class VideoModel {
    id: string;
    info: Info;
    status: VideoStatus;

    public static fromDTO(video: VideoDTO): VideoModel {
        return new VideoModel({
            id: video.id,
            info: {
                title: video.title,
                timestamp: video.timestamp,
                views: video.views,
                author: video.author,
                originalThumbnailUri: video.thumbnailUri,
            },
            status: video.status || VideoStatus.initial,
        });
    }

    constructor({
        id,
        info,
        status,
    }: {
        id: string;
        info: Info;
        status: VideoStatus;
    }) {
        this.id = id;
        this.info = info;
        this.status = status;
    }

    get dir() {
        return createPathIfDoesntExists(path.join(STORAGE_DIR_PATH, this.id));
    }

    get videoPath() {
        return path.join(this.dir, "video.mp4");
    }

    get infoPath() {
        return path.join(this.dir, "info.json");
    }

    get audioPath() {
        return path.join(this.dir, "audio.wav");
    }

    get thumbnailPath() {
        return path.join(this.dir, "thumbnail.jpg");
    }

    get chunksDir() {
        return createPathIfDoesntExists(path.join(this.dir, "chunks"));
    }

    get chunksTodoDir() {
        return createPathIfDoesntExists(path.join(this.chunksDir, "todo"));
    }

    get chunksDoneDir() {
        return createPathIfDoesntExists(path.join(this.chunksDir, "done"));
    }

    get audioChunksTodo() {
        return fs
            .readdirSync(this.chunksTodoDir)
            .map((file) => new AudioModel(path.join(this.chunksTodoDir, file)));
    }

    get audioChunksDone() {
        return fs
            .readdirSync(this.chunksDoneDir)
            .map((file) => new AudioModel(path.join(this.chunksDoneDir, file)));
    }

    get audio() {
        return new AudioModel(this.audioPath);
    }

    get progress() {
        switch (this.status) {
            case VideoStatus.initial:
                return 0;
            case VideoStatus.downloading:
                return 0;
            case VideoStatus.processing:
                const nbChunksDone = this.audioChunksDone.length;
                const nbChunksTodo = this.audioChunksTodo.length;
                if (nbChunksDone + nbChunksTodo === 0) {
                    return 0;
                }
                return Math.floor(
                    (nbChunksDone / (nbChunksDone + nbChunksTodo)) * 100
                );
            case VideoStatus.done:
                return 100;
        }
    }

    stringifyInfo() {
        return JSON.stringify(this.info);
    }

    toDTO() {
        return new VideoDTO({
            id: this.id,
            status: this.status,
            progress: this.progress,
            thumbnailUri:
                this.status === VideoStatus.initial
                    ? this.info.originalThumbnailUri
                    : this.thumbnailPath,
            videoUri: this.videoPath,
            ...this.info,
        });
    }
}