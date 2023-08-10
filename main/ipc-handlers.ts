import { ipcMain, IpcMainInvokeEvent } from "electron";
import isDev from "electron-is-dev";

import {
    getVideoById,
    getAllVideos,
    remove,
    save,
    removeAll,
} from "./repository/video";
import { search } from "./lib/youtube";
import VideoService from "./services/video";
import { initQueue } from "./services/library";
import { toogleDevTools } from "./windows/main-window";
import { openFileExplorer, openLogsInFileExplorer } from "./utils/helpers";
import { mainLogger, rendererLogger } from "./utils/logger";
import VideoDTO from "./dto/video";
import {
    get as getUserPref,
    set as setUserPref,
    setLastMessageSeenTimestamp,
} from "./model/user-preference";
import { OS, STORAGE_DIR_PATH } from "./utils/const";
import { ping as pingMusicRemover } from "./lib/music-remover";
import { MusicRemoverStatus } from "./utils/enum";

export default function initIpcHandlers() {
    ipcMain.handle(
        "youtube:search",
        async (_event: IpcMainInvokeEvent, query): Promise<VideoDTO[]> => {
            mainLogger.debug(`Youtube search for: ${query}`);
            const videos = await search(query);
            return videos;
        }
    );

    ipcMain.handle(
        "video:sendToDownload",
        async (_event: IpcMainInvokeEvent, video: VideoDTO) => {
            const videoService = await VideoService.createFromYt(video);
            await videoService.download();
        }
    );

    ipcMain.handle("video:refresh", async (_event: IpcMainInvokeEvent) => {
        initQueue();
    });

    ipcMain.handle(
        "video:get",
        async (_event: IpcMainInvokeEvent, videoId: string) => {
            const video = getVideoById(videoId);
            return video.toDTO();
        }
    );

    ipcMain.handle("video:getAll", async (_event: IpcMainInvokeEvent) => {
        const videos = await getAllVideos();
        return videos.map((video) => video.toDTO());
    });

    ipcMain.handle(
        "video:delete",
        async (_event: IpcMainInvokeEvent, videoId: string) => {
            const video = getVideoById(videoId);
            remove(video);
        }
    );

    ipcMain.handle("video:deleteAll", async (_event: IpcMainInvokeEvent) => {
        removeAll();
    });

    ipcMain.handle(
        "video:played",
        async (_event: IpcMainInvokeEvent, videoId: string) => {
            const video = getVideoById(videoId);
            video.setPlayed();
            save(video);
        }
    );

    ipcMain.handle(
        "video:process:pause",
        async (_event: IpcMainInvokeEvent, videoId: string) => {
            const video = getVideoById(videoId);
            const videoService = new VideoService(video);
            videoService.pause();
        }
    );

    ipcMain.handle(
        "video:process:resume",
        async (_event: IpcMainInvokeEvent, videoId: string) => {
            const video = getVideoById(videoId);
            const videoService = new VideoService(video);
            videoService.resume();
        }
    );

    ipcMain.handle("devTools:toogle", async (_event: IpcMainInvokeEvent) => {
        toogleDevTools();
    });

    ipcMain.handle(
        "openFileExplorer:logs",
        async (_event: IpcMainInvokeEvent) => {
            openLogsInFileExplorer();
        }
    );

    ipcMain.handle(
        "openFileExplorer:video",
        async (_event: IpcMainInvokeEvent, videoId?: string) => {
            if (videoId) {
                const video = getVideoById(videoId);
                openFileExplorer(video.videoPath);
            } else {
                openFileExplorer(STORAGE_DIR_PATH);
            }
        }
    );

    ipcMain.handle(
        "log:create",
        async (_event: IpcMainInvokeEvent, level, msg) => {
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
        }
    );

    ipcMain.handle("isDev", (_event: IpcMainInvokeEvent) => {
        return isDev;
    });

    ipcMain.handle("isMac", (_event: IpcMainInvokeEvent) => {
        return OS === "mac" ? true : false;
    });

    ipcMain.handle("userPref:get", (_event: IpcMainInvokeEvent, key) => {
        return getUserPref(key);
    });
    ipcMain.handle("userPref:set", (_event: IpcMainInvokeEvent, key, value) => {
        return setUserPref(key, value);
    });
    ipcMain.handle(
        "lastMessageSeenTimestamp:set",
        (_event: IpcMainInvokeEvent, timestamp) => {
            return setLastMessageSeenTimestamp(timestamp);
        }
    );

    ipcMain.handle(
        "music-remover:status:get",
        async (_event: IpcMainInvokeEvent) => {
            try {
                await pingMusicRemover({ recursive: false });
                return MusicRemoverStatus.up;
            } catch (error) {
                return MusicRemoverStatus.down;
            }
        }
    );
}
