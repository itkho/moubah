import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
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
    setPlayed: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:played", videoId),
    pauseProcess: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:process:pause", videoId),
    resumeProcess: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:process:resume", videoId),

    // Main --> Process
    handleVideoUpdatedEvent: (
        callback: (event: IpcRendererEvent, video: VideoDTO) => void
    ) => ipcRenderer.on("video:updated", callback),
};

const musicRemoverApi = {
    // Main --> Process
    handleStatusUpdatedEvent: (
        callback: (event: IpcRendererEvent, status: MusicRemoverStatus) => void
    ) => ipcRenderer.on("music-remover:status:updated", callback),
};

const mainApi = {
    // Process --> Main
    toogleDevTools: () => ipcRenderer.invoke("devTools:toogle"),
    openLogsDir: () => ipcRenderer.invoke("openFileExplorer:logs"),
    log: (level: string, msg: string) =>
        ipcRenderer.invoke("log:create", level, msg),
    isDev: (): Promise<boolean> => ipcRenderer.invoke("isDev"),
    isMac: (): Promise<boolean> => ipcRenderer.invoke("isMac"),
    getUserPrefDarkMode: (): Promise<boolean> =>
        ipcRenderer.invoke("userPref:get", "darkMode"),
    setUserPrefDarkMode: (dark: boolean) =>
        ipcRenderer.invoke("userPref:set", "darkMode", dark),
    getUserPrefLang: (): Promise<string> =>
        ipcRenderer.invoke("userPref:get", "lang"),
    setUserPrefLang: (lang: string) =>
        ipcRenderer.invoke("userPref:set", "lang", lang),
};

contextBridge.exposeInMainWorld("videoApi", videoApi);
contextBridge.exposeInMainWorld("musicRemoverApi", musicRemoverApi);
contextBridge.exposeInMainWorld("mainApi", mainApi);
