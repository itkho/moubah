import fs from "fs";
import path from "path";
import download from "image-downloader";

import { get as getMainWindow } from "../windows/main-window";
import VideoModel from "../model/video.js";
import { STORAGE_DIR_PATH } from "../utils/const.js";
import { mainLogger } from "../utils/logger.js";

export function getVideoById(id: string) {
    const videoPath = path.join(STORAGE_DIR_PATH, id);
    if (!fs.existsSync(videoPath)) {
        throw Error(`Video ${id} not found`);
    }

    let info;
    try {
        info = JSON.parse(
            fs.readFileSync(path.join(videoPath, "info.json")).toString()
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
    const { status, metadata, ...videoInfo } = info;
    return new VideoModel({
        id: id,
        info: videoInfo,
        metadata: metadata,
        status: status,
    });
}

export function getAllVideos() {
    const videoIds = fs
        .readdirSync(STORAGE_DIR_PATH, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
    const videos = Promise.all(
        videoIds.map((videoId) => {
            return getVideoById(videoId);
        })
    );
    return videos;
}

// TODO: remove the async/await
export async function getVideosTodo() {
    const videos = await getAllVideos();
    const videosTodo = videos.filter((video) => {
        if (video.metadata.isPending) return false;
        return video.audioChunksTodo.length !== 0;
    });
    return videosTodo;
}

export function reload(video: VideoModel) {
    return getVideoById(video.id);
}

export function save(video: VideoModel) {
    const videoInfo = {
        status: video.status,
        metadata: video.metadata,
        ...video.info,
    };
    const test = JSON.stringify(videoInfo);

    try {
        fs.writeFileSync(path.join(video.infoPath), test);
    } catch (error) {
        mainLogger.error(error);
        return;
    }

    if (!fs.existsSync(video.thumbnailPath)) {
        download.image({
            url: video.info.originalThumbnailUri,
            dest: video.thumbnailPath,
        });
    }
    getMainWindow().webContents.send("video:updated", video.toDTO());
}

export function remove(video: VideoModel) {
    if (!video.dir.includes(STORAGE_DIR_PATH))
        throw "Cannot remove this folder (out of access scope)";
    fs.rmSync(video.dir, { recursive: true, force: true });
}
