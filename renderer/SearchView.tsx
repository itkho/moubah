import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import VideoResult from "./components/VideoResult";
import VideoDTO from "../main/dto/video";

export default function SearchView({ hidden }: { hidden: boolean }) {
    console.log("SearchView mounted!");

    const [videos, setVideos] = useState<VideoDTO[]>([]);
    const [query, setQuery] = useState("");

    async function search() {
        const videos = (await window.videoApi.getYoutubeResult(query)).map(
            (video) => new VideoDTO(video)
        );
        setVideos(videos);
    }

    function onChange(e: any) {
        setQuery(e.target.value);
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

                    {videos.length ? <VideoResult videos={videos} /> : null}
                </div>
            )}
        </>
    );
}
