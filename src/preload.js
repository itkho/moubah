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

    // Main --> Process
    handleVideoUpdatedEvent: (callback) =>
        ipcRenderer.on("video:updated", callback),
});

contextBridge.exposeInMainWorld("musicRemoverAPI", {
    // Main --> Process
    handleStatusUpdatedEvent: (callback) =>
        ipcRenderer.on("music-remover:status:updated", callback),
});

contextBridge.exposeInMainWorld("mainAPI", {
    // Process --> Main
    toogleDevTools: () => ipcRenderer.invoke("devTools:toogle"),
    openLogsDir: () => ipcRenderer.invoke("openFileExplorer:logs"),
    log: (level, msg) => ipcRenderer.invoke("log:create", level, msg),
});
