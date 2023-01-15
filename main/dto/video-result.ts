import VideoDTO from "./video";

interface Author {
    name: string;
    url: string;
}

export default class VideoResultDTO {
    id: string;
    title: string;
    thumbnail: string;
    timestamp: string;
    views: number;
    author: Author;

    constructor(video: {
        id: string;
        title: string;
        thumbnail: string;
        timestamp: string;
        views: number;
        author: Author;
    }) {
        this.id = video.id;
        this.title = video.title;
        this.thumbnail = video.thumbnail;
        this.timestamp = video.timestamp;
        this.views = video.views;
        this.author = video.author;
    }

    test() {
        console.log("TEST");
        return "OK";
    }

    toVideoDTO() {
        return new VideoDTO(this.id, this.title, this.thumbnail);
    }
}
