import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import VideoDTO from "./dto/video";
import { MusicRemoverStatus, VideoQuality } from "./utils/enum";
import { TypeOptions } from "react-toastify";

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
    getYoutubeVideoQualityList: (videoId: string): Promise<string[]> =>
        ipcRenderer.invoke("youtube:video:quality:get", videoId),
    sendToDownload: (video: VideoDTO): Promise<void> =>
        ipcRenderer.invoke("video:sendToDownload", video),
    refresh: (): Promise<void> => ipcRenderer.invoke("video:refresh"),
    delete: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:delete", videoId),
    deleteAll: (): Promise<void> => ipcRenderer.invoke("video:deleteAll"),
    getById: (videoId: string): Promise<VideoDTO> =>
        ipcRenderer.invoke("video:get", videoId),
    getAll: async (): Promise<VideoDTO[]> => ipcRenderer.invoke("video:getAll"),
    setPlayed: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:played", videoId),
    pauseProcess: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:process:pause", videoId),
    resumeProcess: (videoId: string): Promise<void> =>
        ipcRenderer.invoke("video:process:resume", videoId),
    openDir: (videoId?: string): Promise<void> =>
        ipcRenderer.invoke("openFileExplorer:video", videoId),

    // Main --> Process
    handleVideoUpdatedEvent: (
        callback: (event: IpcRendererEvent, video: VideoDTO) => void
    ) => ipcRenderer.on("video:updated", callback),
};

const musicRemoverApi = {
    // Process --> Main
    getStatus: async (): Promise<MusicRemoverStatus> =>
        ipcRenderer.invoke("music-remover:status:get"),

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
    versionNumber: (): Promise<string> => ipcRenderer.invoke("versionNumber"),
    isDev: (): Promise<boolean> => ipcRenderer.invoke("isDev"),
    isMac: (): Promise<boolean> => ipcRenderer.invoke("isMac"),
    getUserPrefDarkMode: (): Promise<boolean> =>
        ipcRenderer.invoke("userPref:get", "darkMode"),
    setUserPrefDarkMode: (dark: boolean) =>
        ipcRenderer.invoke("userPref:set", "darkMode", dark),
    getUserPrefQuality: (): Promise<VideoQuality> =>
        ipcRenderer.invoke("userPref:get", "quality"),
    setUserPrefQuality: (quality: VideoQuality) =>
        ipcRenderer.invoke("userPref:set", "quality", quality),
    getUserPrefLang: (): Promise<string> =>
        ipcRenderer.invoke("userPref:get", "lang"),
    setUserPrefLang: (lang: string) =>
        ipcRenderer.invoke("userPref:set", "lang", lang),
    lastMessageSeenTimestamp: (timestamp: number) =>
        ipcRenderer.invoke("lastMessageSeenTimestamp:set", timestamp),

    // Main --> Process
    handleNewToastMessage: (
        callback: (
            event: IpcRendererEvent,
            timestamp: number,
            type: TypeOptions,
            text: string,
            link: string
        ) => void
    ) => ipcRenderer.on("message:new", callback),
};

contextBridge.exposeInMainWorld("videoApi", videoApi);
contextBridge.exposeInMainWorld("musicRemoverApi", musicRemoverApi);
contextBridge.exposeInMainWorld("mainApi", mainApi);
