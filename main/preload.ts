import { ipcRenderer, contextBridge } from "electron";

declare global {
    interface Window {
        videoApi: typeof videoApi;
        musicRemoverApi: typeof musicRemoverApi;
        mainApi: typeof mainApi;
    }
}

const videoApi = {
    // Process --> Main
    getYoutubeResult: (query: string) =>
        ipcRenderer.invoke("youtube:search", query),
    sendToDownload: (videoId: string) =>
        ipcRenderer.invoke("video:sendToDownload", videoId),
    refresh: () => ipcRenderer.invoke("video:refresh"),
    delete: (videoId: string) => ipcRenderer.invoke("video:delete", videoId),
    getById: (videoId: string) => ipcRenderer.invoke("video:get", videoId),
    getAll: async () => ipcRenderer.invoke("video:getAll"),

    // Main --> Process
    // TODO: check the typing here
    handleVideoUpdatedEvent: (callback: (data: any) => void) =>
        ipcRenderer.on("video:updated", callback),

    /**
     * Here you can expose functions to the renderer process
     * so they can interact with the main (electron) side
     * without security problems.
     *
     * The function below can accessed using `window.videoApi.sayHello`
     */
    sendMessage: (message: string) => {
        ipcRenderer.send("message", message);
    },
    /**
    Here function for AppBar
   */
    Minimize: () => {
        ipcRenderer.send("minimize");
    },
    Maximize: () => {
        ipcRenderer.send("maximize");
    },
    Close: () => {
        ipcRenderer.send("close");
    },
    /**
     * Provide an easier way to listen to events
     */
    on: (channel: string, callback: (data: any) => void) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
};

const musicRemoverApi = {
    // Main --> Process
    // TODO: check the typing here
    handleStatusUpdatedEvent: (callback: (data: any) => void) =>
        ipcRenderer.on("music-remover:status:updated", callback),
};

const mainApi = {
    // Process --> Main
    toogleDevTools: () => ipcRenderer.invoke("devTools:toogle"),
    openLogsDir: () => ipcRenderer.invoke("openFileExplorer:logs"),
    log: (level: string, msg: string) =>
        ipcRenderer.invoke("log:create", level, msg),
};

contextBridge.exposeInMainWorld("videoApi", videoApi);
contextBridge.exposeInMainWorld("musicRemoverApi", musicRemoverApi);
contextBridge.exposeInMainWorld("mainApi", mainApi);
