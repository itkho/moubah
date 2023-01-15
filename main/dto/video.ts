import { VideoStatus } from "../utils/enum";

export default class VideoDTO {
    id: string;
    title: string;
    videoUri?: string;
    thumbnailUri: string;
    status: VideoStatus;
    progress: number;

    constructor(
        id: string,
        title: string,
        thumbnailUri: string,
        videoUri?: string,
        status: VideoStatus = VideoStatus.initial,
        progress: number = 0
    ) {
        this.id = id;
        this.title = title;
        this.videoUri = videoUri;
        this.thumbnailUri = thumbnailUri;
        this.status = status;
        this.progress = progress;
    }
}
