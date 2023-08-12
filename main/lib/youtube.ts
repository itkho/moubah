import ytSearch from "yt-search";
import ytdl from "ytdl-core";
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

export async function getQualityAvailable(videoId: string): Promise<string[]> {
    const qualityList = (await ytdl.getInfo(videoId)).formats
        .filter(
            (format) =>
                format.hasVideo &&
                !format.hasAudio &&
                format.container === "mp4"
        )
        .map((format) => format.qualityLabel);
    return [...new Set(qualityList)];
}
