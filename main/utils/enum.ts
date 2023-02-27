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

export enum MusicRemoverStatus {
    up,
    down,
}
