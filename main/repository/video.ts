import jetpack from "fs-jetpack";
import fs from "fs";
import path from "path";
import download from "image-downloader";

import VideoModel from "../model/video.js";
import { STORAGE_DIR_PATH } from "../utils/const.js";

export async function getVideoById(id: string) {
    const videoPath = path.join(STORAGE_DIR_PATH, id);
    if (!fs.existsSync(videoPath)) {
        throw Error(`Video ${id} not found`);
    }
    const info = jetpack.read(path.join(videoPath, "info.json"), "json");
    return new VideoModel(
        id,
        info.title,
        path.join(videoPath, "thumbnail.jpg"),
        info.status // as VideoStatus
    );
}

export async function getAllVideos() {
    const videoIds = fs
        .readdirSync(STORAGE_DIR_PATH, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
    const videos = await Promise.all(
        videoIds.map(async (videoId) => {
            return await getVideoById(videoId);
        })
    );
    return videos;
}

export async function getVideosTodo() {
    const videos = await getAllVideos();
    const videosTodo = videos.filter(
        (video) => video.audioChunksTodo.length !== 0
    );
    return videosTodo;
}

export function save(video: VideoModel) {
    if (!fs.existsSync(video.dir)) {
        fs.mkdirSync(video.dir);
    }
    fs.writeFile(path.join(video.infoPath), video.stringifyInfo(), (err) => {
        if (err) throw err;
    });
    if (!fs.existsSync(video.thumbnailPath)) {
        download.image({
            url: video.thumbnailUri,
            dest: video.thumbnailPath,
        });
    }
}

export function remove(video: VideoModel) {
    if (!video.dir.includes(STORAGE_DIR_PATH))
        throw "Cannot remove this folder (out of access scope)";
    fs.rmSync(video.dir, { recursive: true, force: true });
}
