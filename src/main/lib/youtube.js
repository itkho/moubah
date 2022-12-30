const ytSearch = require("yt-search");

const VideoResultDTO = require("../../dto/video-result.js");

class YouTube {
    constructor() {
        throw new TypeError("Cannot construct FFmpeg instances directly");
    }

    static async search(query) {
        const res = await ytSearch(query);
        const videoResultDTO = res.videos.map(
            (video) =>
                new VideoResultDTO({
                    id: video.videoId,
                    title: video.title,
                    thumbnail: video.thumbnail,
                    timestamp: video.timestamp,
                    views: video.views,
                    author: video.author,
                })
        );
        return videoResultDTO;
    }
}

module.exports = YouTube;
