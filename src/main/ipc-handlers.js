const { ipcMain } = require("electron");

const VideoRepository = require("./repository/video");
const YouTube = require("./lib/youtube");
const VideoService = require("./services/video");

function initIpcHandlers() {
    ipcMain.handle("youtube:search", (_event, query) => {
        const res = YouTube.search(query);
        return res;
    });

    ipcMain.handle("video:sendToDownload", async (_event, videoId) => {
        const videoService = await VideoService.createFromYtId(videoId);
        await videoService.download();
    });

    ipcMain.handle("video:get", async (_event, videoId) => {
        const video = await VideoRepository.getVideoById(videoId);
        return video.toDTO();
    });

    ipcMain.handle("video:getAll", async (_event) => {
        const videos = await VideoRepository.getAllVideos();
        return videos.map((video) => video.toDTO());
    });

    ipcMain.handle("video:delete", async (_event, videoId) => {
        const video = await VideoRepository.getVideoById(videoId);
        VideoRepository.delete(video);
    });
}

module.exports = initIpcHandlers;
