import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import VideoDTO from "../dto/video.js";
import { app } from "electron";
import isDev from "electron-is-dev";
import fs from "fs";
import path from "path";
import { VideoQuality } from "../utils/enum.js";
import {
    convertStringToEnum,
    resForQuality,
    sortQuality,
} from "../utils/helpers.js";

export async function search(query: string) {
    let res;

    if (isDev) {
        res = JSON.parse(
            fs
                .readFileSync(
                    path.join(
                        app.getAppPath(),
                        "tests/mock_result_ytSearch.json"
                    )
                )
                .toString()
        ) as { videos: any[] };
    } else {
        res = await ytSearch(query);
    }

    return res.videos.map(
        (video: any) =>
            new VideoDTO({
                ...video,
                id: video.videoId,
                thumbnailUri: video.thumbnail,
                videoUri: video.url,
            })
    );
}

// Return all qualities available for this video ID sorted from the lowest to the highest
export async function getQualityAvailable(
    videoId: string
): Promise<VideoQuality[]> {
    const qualityList = (await ytdl.getInfo(videoId)).formats
        .filter(
            (format) =>
                format.hasVideo &&
                !format.hasAudio &&
                format.container === "mp4"
        )
        .map((format) => convertStringToEnum(VideoQuality, format.qualityLabel))
        .filter((format): format is VideoQuality => format !== undefined);
    const tmp = sortQuality([...new Set(qualityList)]);
    return tmp;
}

// If the wanted quality isn't possible, the next one with a lower quality is returned
// If no lower quality than the wanted quality is possible, the lowest quality is returned
export async function getClosestQualityAvailable(
    videoId: string,
    wantedQuality: VideoQuality = VideoQuality.p720
): Promise<VideoQuality> {
    const qualityList = await getQualityAvailable(videoId);

    // Case where closestQuality == wantedQuality
    if (wantedQuality in qualityList) return wantedQuality;

    // Case where closestQuality < wantedQuality
    const resWanted = resForQuality(wantedQuality);
    // Start for the end since the array is ascending ordered
    for (let i = qualityList.length - 1; i >= 0; i--) {
        const res = resForQuality(qualityList[i]);
        if (res < resWanted) {
            return qualityList[i];
        }
    }

    // Case where closestQuality > wantedQuality
    return qualityList[0];
}
