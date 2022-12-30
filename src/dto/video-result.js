class VideoResultDTO {
    constructor({ id, title, thumbnail, timestamp, views, author }) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.timestamp = timestamp;
        this.views = views;
        this.author = author;
    }
}

module.exports = VideoResultDTO;
