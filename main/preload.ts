import { ipcRenderer, contextBridge } from "electron";
import VideoDTO from "./dto/video";
import { MusicRemoverStatus } from "./utils/enum";

declare global {
    interface Window {
        videoApi: typeof videoApi;
        musicRemoverApi: typeof musicRemoverApi;
        mainApi: typeof mainApi;
    }
}

const videoApi = {
    // Process --> Main
    getYoutubeResult: (query: string): Promise<VideoDTO[]> =>
        ipcRenderer.invoke("youtube:search", query),
    sendToDownload: (video: VideoDTO): Promise<void> =>
        ipcRenderer.invoke("video:sendToDownload", video),
    refresh: (): Promise<void> => ipcRenderer.invoke("video:refresh"),
    delete: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:delete", videoId),
    getById: (videoId: string): Promise<VideoDTO> =>
        ipcRenderer.invoke("video:get", videoId),
    getAll: async (): Promise<VideoDTO[]> => ipcRenderer.invoke("video:getAll"),

    // Main --> Process
    handleVideoUpdatedEvent: (
        callback: (event: any, video: VideoDTO) => void
    ) => ipcRenderer.on("video:updated", callback),
};

const musicRemoverApi = {
    // Main --> Process
    handleStatusUpdatedEvent: (
        callback: (event: any, status: MusicRemoverStatus) => void
    ) => ipcRenderer.on("music-remover:status:updated", callback),
};

const mainApi = {
    // Process --> Main
    toogleDevTools: () => ipcRenderer.invoke("devTools:toogle"),
    openLogsDir: () => ipcRenderer.invoke("openFileExplorer:logs"),
    log: (level: string, msg: string) =>
        ipcRenderer.invoke("log:create", level, msg),
    isDev: (): Promise<boolean> => ipcRenderer.invoke("isDev"),
};

contextBridge.exposeInMainWorld("videoApi", videoApi);
contextBridge.exposeInMainWorld("musicRemoverApi", musicRemoverApi);
contextBridge.exposeInMainWorld("mainApi", mainApi);
