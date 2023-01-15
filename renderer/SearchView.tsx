import React, { useState } from "react";
import {
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/solid";
import VideoResultDTO from "../main/dto/video-result";
import { abbrNum } from "./utils";
import { useLocalVideo } from "./context/LocalVideoContext";

export default function SearchView({ hidden }: { hidden: boolean }) {
    console.log("SearchView mounted!");

    const { localVideoIds, addLocalVideo } = useLocalVideo();

    const [videoIndex, setVideoIndex] = useState(0);
    const [videos, setVideos] = useState<VideoResultDTO[]>([]);
    const [query, setQuery] = useState("");

    async function search() {
        const videos = (await window.videoApi.getYoutubeResult(query)).map(
            (video) => new VideoResultDTO(video)
        );
        setVideos(videos);
    }

    function onChange(e: any) {
        setQuery(e.target.value);
    }

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
        // window.videoApi.sendToDownload(video.id);
        addLocalVideo(video);
    }

    return (
        <>
            {!hidden && (
                <div className="h-full flex flex-col justify-between items-center">
                    <div className="flex my-10 w-1/3">
                        <input
                            className="grow outline-none p-1 border-2 rounded-l border-gray-2 bg-gray-1 placeholder-gray-500"
                            value={query}
                            placeholder="Enter a title or an URL"
                            onChange={onChange}
                            type="search"
                        />
                        <button
                            className="p-1 border-2 rounded-r border-gray-2 bg-gray-2"
                            onClick={search}
                        >
                            <MagnifyingGlassIcon className="h-4 stroke-current stroke-1 text-background" />
                        </button>
                    </div>

                    {videos.length ? (
                        <>
                            <div className="flex justify-between items-center">
                                <div>
                                    <ArrowLeftIcon
                                        className={`h-10 m-20 ${
                                            videoIndex === 0
                                                ? "text-gray-1"
                                                : ""
                                        }`}
                                        onClick={prevVideo}
                                    />
                                </div>
                                <div className="basis-4/6">
                                    <div className="overflow-hidden overflow-ellipsis">
                                        Title: {videos[videoIndex].title}
                                    </div>
                                    <img
                                        className="aspect-video"
                                        src={videos[videoIndex].thumbnail}
                                        alt="Thumbnail"
                                    />
                                    <div>
                                        Duration: {videos[videoIndex].timestamp}{" "}
                                        | Views:{" "}
                                        {abbrNum(videos[videoIndex].views)}
                                    </div>
                                    <div>
                                        Author: {videos[videoIndex].author.name}
                                    </div>
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
                            <div className="">
                                <button
                                    onClick={removeMusic}
                                    className={`my-10 p-3 bg-gray-1 hover:bg-gray-2 hover:text-gray-1 rounded ${
                                        // null
                                        localVideoIds.includes(
                                            videos[videoIndex].id
                                        )
                                            ? "line-through pointer-events-none"
                                            : ""
                                    }`}
                                >
                                    🔇 Remove background music
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </>
    );
}
