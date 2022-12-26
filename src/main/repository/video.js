const jetpack = require("fs-jetpack");
const fs = require("fs");
const path = require("path");
const download = require('image-downloader');

const VideoModel = require("../model/video.js");
const { STORAGE_DIR_PATH } = require("../const.js");


class VideoRepository {

    static async getAllVideos() {
        const videoIds = fs.readdirSync(STORAGE_DIR_PATH, { "withFileTypes": true })
            .filter(item => item.isDirectory())
            .map(item => item.name);
        const videos = await Promise.all(videoIds.map(async (videoId) => {
            return await VideoRepository.getVideoById(videoId);
        }));
        return videos
    }

    static async getVideosTodo() {
        const videos = await VideoRepository.getAllVideos();
        const videosTodo = videos.filter(video => video.audioChunksTodo.length !== 0);
        return videosTodo;
    }

    static async getVideoById(id) {
        const videoPath = path.join(STORAGE_DIR_PATH, id)
        if (!fs.existsSync(videoPath)) {
            return null;
        }
        const info = jetpack.read(path.join(videoPath, "info.json"), "json");
        return new VideoModel({
            id: id,
            title: info.title,
            thumbnailUri: path.resolve(videoPath, "thumbnail.jpg"),
            status: info.status
        });
    }

    static save(video) {
        if (!fs.existsSync(video.dir)) {
            fs.mkdirSync(video.dir);
        }
        fs.writeFile(
            path.resolve(video.infoPath),
            video.stringifyInfo(),
            (err) => {
                if (err) throw err;
            }
        );
        if (!fs.existsSync(video.thumbnailPath)) {
            download.image({ url: video.thumbnailUri, dest: video.thumbnailPath });
        }
    }

    static delete(video) {
        fs.rmSync(video.dir, { recursive: true, force: true });
    }
}

module.exports = VideoRepository