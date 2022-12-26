const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("videoAPI", {

    // Process --> Main
    getYoutubeResult: (query) => ipcRenderer.invoke("youtube:search", query),
    sendToDownload: (videoId) => ipcRenderer.invoke("video:sendToDownload", videoId),
    getById: (videoId) => ipcRenderer.invoke("video:get", videoId),
    getAll: async () => ipcRenderer.invoke("video:getAll"),
    // TODO: finish the implementation
    getBackendStatus: () => ipcRenderer.invoke("backend:status"),

    // Main --> Process
    handleVideoUpdatedEvent: (callback) => ipcRenderer.on("video:updated", callback),

})
