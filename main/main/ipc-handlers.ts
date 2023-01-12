import { ipcMain } from "electron";

import { getVideoById, getAllVideos, remove } from "./repository/video";
import { search } from "./lib/youtube";
import VideoService from "./services/video";
import { initQueue } from "./services/library";
import { toogleDevTools } from "../main-window";
import { openLogsInFileExplorer } from "./helpers";
import { rendererLogger } from "./logger";

export default function initIpcHandlers() {
    ipcMain.handle("youtube:search", (_event, query) => {
        const res = search(query);
        return res;
    });

    ipcMain.handle("video:sendToDownload", async (_event, videoId) => {
        const videoService = await VideoService.createFromYtId(videoId);
        await videoService.download();
    });

    ipcMain.handle("video:refresh", async (_event) => {
        initQueue();
    });

    ipcMain.handle("video:get", async (_event, videoId) => {
        const video = await getVideoById(videoId);
        return video.toDTO();
    });

    ipcMain.handle("video:getAll", async (_event) => {
        const videos = await getAllVideos();
        return videos.map((video) => video.toDTO());
    });

    ipcMain.handle("video:delete", async (_event, videoId) => {
        const video = await getVideoById(videoId);
        remove(video);
    });

    ipcMain.handle("devTools:toogle", async (_event) => {
        toogleDevTools();
    });

    ipcMain.handle("openFileExplorer:logs", async (_event) => {
        openLogsInFileExplorer();
    });

    ipcMain.handle("log:create", async (_event, level, msg) => {
        switch (level) {
            case "debug":
                rendererLogger.debug(msg);
                break;
            case "info":
                rendererLogger.info(msg);
                break;
            case "warn":
                rendererLogger.warn(msg);
                break;
            case "error":
                rendererLogger.error(msg);
                break;
            default:
                rendererLogger.info(msg);
                break;
        }
    });
}
