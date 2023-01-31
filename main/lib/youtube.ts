import ytSearch from "yt-search";
import VideoDTO from "../dto/video.js";

export async function search(query: string) {
    const res = await ytSearch(query);
    return res.videos.map(
        (video) =>
            new VideoDTO({
                ...video,
                id: video.videoId,
                thumbnailUri: video.thumbnail,
                videoUri: video.url,
            })
    );
}
