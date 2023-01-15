import path from "path";
import fs from "fs";
import { STORAGE_DIR_PATH } from "../utils/const.js";

import { VideoStatus } from "../utils/enum.js";
import AudioModel from "./audio.js";
import { createPathIfDoesntExists } from "../utils/helpers.js";
import VideoDTO from "../dto/video.js";

export default class VideoModel {
    id: string;
    title: string;
    thumbnailUri: string;
    status: VideoStatus;

    constructor(
        id: string,
        title: string,
        thumbnailUri: string,
        status = VideoStatus.initial
    ) {
        this.id = id;
        this.title = title;
        this.thumbnailUri = thumbnailUri;
        this.status = status;
    }

    get dir() {
        return createPathIfDoesntExists(path.join(STORAGE_DIR_PATH, this.id));
    }

    get path() {
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
        return JSON.stringify({
            title: this.title,
            status: this.status,
        });
    }

    toDTO() {
        return new VideoDTO(
            this.id,
            this.title,
            this.thumbnailUri,
            this.path,
            this.status,
            this.progress
        );
    }
}
