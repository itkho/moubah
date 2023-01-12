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

    constructor(
        id: string,
        title: string,
        thumbnail: string,
        timestamp: string,
        views: number,
        author: Author
    ) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.timestamp = timestamp;
        this.views = views;
        this.author = author;
    }
}
