// TODO: Doesn't seem possible to import it in ES6 module (renderer process)

import { VideoStatus } from "../utils/enum";

// See with TypeScript if it's not better?
export default class VideoDTO {
    id: string;
    title: string;
    videoUri: string;
    thumbnailUri: string;
    status: VideoStatus;
    progress: number;

    constructor(
        id: string,
        title: string,
        videoUri: string,
        thumbnailUri: string,
        status: VideoStatus,
        progress: number
    ) {
        this.id = id;
        this.title = title;
        this.videoUri = videoUri;
        this.thumbnailUri = thumbnailUri;
        this.status = status;
        this.progress = progress;
    }
}
