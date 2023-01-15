import ytSearch from "yt-search";

import VideoResultDTO from "../dto/video-result.js";

export async function search(query: string) {
    const res = await ytSearch(query);
    const videoResults = res.videos.map(
        (video) =>
            new VideoResultDTO({
                id: video.videoId,
                ...video,
            })
    );
    return videoResults;
}
