import React, { useState } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { abbrNum } from "../utils/helpers";
import { useLocalVideo } from "../context/LocalVideoContext";
import VideoDTO from "../../main/dto/video";

export default function VideoResult({ videos }: { videos: VideoDTO[] }) {
    console.log("VideoResult mounted!");

    const { localVideoIds, addLocalVideo } = useLocalVideo();
    const [videoIndex, setVideoIndex] = useState(0);

    function prevVideo() {
        if (videoIndex - 1 >= 0) {
            setVideoIndex((currVideoIndex) => currVideoIndex - 1);
        }
    }

    function nextVideo() {
        if (videoIndex + 1 <= videos.length - 1) {
            setVideoIndex((currVideoIndex) => currVideoIndex + 1);
        }
    }

    function removeMusic() {
        const video = videos[videoIndex];
        window.videoApi.sendToDownload(video);
        addLocalVideo(video);
    }

    return (
        <div className="grow flex flex-col justify-evenly items-center">
            <div className="flex items-center">
                <div>
                    <ArrowLeftIcon
                        className={`h-10 m-20 ${
                            videoIndex === 0 ? "text-gray-1" : ""
                        }`}
                        onClick={prevVideo}
                    />
                </div>
                <div className="basis-4/6">
                    <div className="h-12 line-clamp-2">
                        Title: {videos[videoIndex].title}
                    </div>
                    <img
                        className="my-5 aspect-video shadow-xl"
                        src={videos[videoIndex].thumbnailUri}
                        alt="Thumbnail"
                    />
                    <div>
                        Duration: {videos[videoIndex].timestamp} | Views:{" "}
                        {abbrNum(videos[videoIndex].views)}
                    </div>
                    <div>Author: {videos[videoIndex].author.name}</div>
                </div>
                <div>
                    <ArrowRightIcon
                        className={`h-10 m-20 ${
                            videoIndex === videos.length - 1
                                ? "text-gray-1"
                                : ""
                        }`}
                        onClick={nextVideo}
                    />
                </div>
            </div>
            <div>
                <button
                    onClick={removeMusic}
                    className={`my-10 p-3 bg-gray-1 hover:bg-gray-2 hover:text-gray-1 rounded ${
                        localVideoIds.includes(videos[videoIndex].id)
                            ? "line-through pointer-events-none"
                            : ""
                    }`}
                >
                    🔇 Remove background music
                </button>
            </div>
        </div>
    );
}
