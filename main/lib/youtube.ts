import ytSearch from "yt-search";
import VideoDTO from "../dto/video.js";

export async function search(query: string) {
    const res = await ytSearch(query);
    const videoResults = res.videos.map(
        (video) =>
            new VideoDTO({
                id: video.videoId,
                thumbnailUri: video.thumbnail,
                ...video,
            })
    );
    return videoResults;
}
