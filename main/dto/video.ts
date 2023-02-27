import { VideoStatus } from "../utils/enum";
export interface Author {
    name: string;
    url: string;
}

export interface Metadata {
    downloadingProgress?: number;
    isNew?: boolean;
    isPending?: boolean;
    creationTimestamp?: number;
}

export default class VideoDTO {
    id: string;
    title: string;
    thumbnailUri: string;
    timestamp: string;
    views: number;
    author: Author;
    status?: VideoStatus;
    progress?: number;
    videoUri?: string;
    metadata: Metadata;

    constructor(video: {
        id: string;
        title: string;
        thumbnailUri: string;
        timestamp: string;
        views: number;
        author: Author;
        status?: VideoStatus;
        progress?: number;
        videoUri?: string;
        metadata?: Metadata;
    }) {
        this.id = video.id;
        this.title = video.title;
        this.thumbnailUri = video.thumbnailUri;
        this.timestamp = video.timestamp;
        this.views = video.views;
        this.author = video.author;
        this.status = video.status;
        this.progress = video.progress;
        this.videoUri = video.videoUri;
        this.metadata = video.metadata || {};
    }
}
