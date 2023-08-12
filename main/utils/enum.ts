export enum VideoStatus {
    initial = "initial",
    downloading = "downloading",
    processing = "processing",
    done = "done",
}

export enum QueueName {
    // HighPriorityAudioChunks = "audio-chunk:high-priority",
    LowPriorityAudioChunks = "audio-chunk:low-priority",
}

// This enum is used in both main and renderer code base
// TODO: move this in a shared folder
export enum MusicRemoverStatus {
    up,
    down,
}

// This enum is used in both main and renderer code base
// TODO: move this in a shared folder
export enum VideoQuality {
    p144 = "144p",
    p240 = "240p",
    p270 = "270p",
    p360 = "360p",
    p480 = "480p",
    p720 = "720p",
    p1080 = "1080p", // HD
    p1440 = "1440p", // HD
    p2160 = "2160p", // 4k
    p4320 = "4320p", // 8k
}
