import { VideoStatus } from "../utils/enum";
interface Author {
    name: string;
    url: string;
}

export default class VideoDTO {
    id: string;
    title: string;
    videoUri?: string;
    thumbnailUri: string;
    status: VideoStatus;
    progress: number;
    timestamp?: string;
    views?: number;
    author?: Author;

    constructor(video: {
        id: string;
        title: string;
        thumbnailUri: string;
        videoUri?: string;
        status?: VideoStatus;
        progress?: number;
        timestamp?: string;
        views?: number;
        author?: Author;
    }) {
        this.id = video.id;
        this.title = video.title;
        this.videoUri = video.videoUri;
        this.thumbnailUri = video.thumbnailUri;
        this.status = video.status || VideoStatus.initial;
        this.progress = video.progress || 0;
        this.timestamp = video.timestamp;
        this.views = video.views;
        this.author = video.author;
    }
}
