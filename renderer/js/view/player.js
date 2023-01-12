const player = videojs("video-player", {
    aspectRatio: "16:9",
});

export default class Player {
    constructor() {
        throw new TypeError("Cannot construct Player instances directly");
    }

    static initPlayer() {
        // TODO: call this with the video of the last session
        // this.changeSource(
        //     "/Users/karim/perso/projects/moubah/storage/Gjnup-PuquQ/video.mp4",
        //     "/Users/karim/perso/projects/moubah/storage/Gjnup-PuquQ/thumbnail.jpg",
        // )
    }

    static changeSource(videoUri, thumbnailUri) {
        player.poster(thumbnailUri);
        player.src({ src: videoUri, type: "video/mp4" });
    }
}
