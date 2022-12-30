// TODO: Doesn't seem possible to import it in ES6 module (renderer process)
// See with TypeScript if it's not better?
class VideoDTO {
    constructor({ id, title, videoUri, thumbnailUri, status, progress }) {
        this.id = id;
        this.title = title;
        this.videoUri = videoUri;
        this.thumbnailUri = thumbnailUri;
        this.status = status;
        this.progress = progress;
    }
}

module.exports = VideoDTO;
