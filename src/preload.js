const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("videoAPI", {
    // Process --> Main
    getYoutubeResult: (query) => ipcRenderer.invoke("youtube:search", query),
    sendToDownload: (videoId) =>
        ipcRenderer.invoke("video:sendToDownload", videoId),
    refresh: () => ipcRenderer.invoke("video:refresh"),
    delete: (videoId) => ipcRenderer.invoke("video:delete", videoId),
    getById: (videoId) => ipcRenderer.invoke("video:get", videoId),
    getAll: async () => ipcRenderer.invoke("video:getAll"),
    // TODO: create an other contextBrige for this
    toogleDevTools: () => ipcRenderer.invoke("devTools:toogle"),
    openLogsDir: () => ipcRenderer.invoke("openFileExplorer:logs"),
    log: (level, msg) => ipcRenderer.invoke("log:create", level, msg),

    // Main --> Process
    handleVideoUpdatedEvent: (callback) =>
        ipcRenderer.on("video:updated", callback),
    // TODO: create an other contextBrige for this
    handleMusicRemoverStatusUpdatedEvent: (callback) =>
        ipcRenderer.on("music-remover:status:updated", callback),
});
