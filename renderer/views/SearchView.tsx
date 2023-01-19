import React, {
    FormEventHandler,
    KeyboardEventHandler,
    useRef,
    useState,
} from "react";
import {
    ArrowLongUpIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import VideoResult from "../components/VideoResult";
import VideoDTO from "../../main/dto/video";

export default function SearchView({ hidden }: { hidden: boolean }) {
    console.log("SearchView mounted!");

    const [videos, setVideos] = useState<VideoDTO[]>([]);
    const [query, setQuery] = useState("");
    const searchButton = useRef<HTMLButtonElement>(null);

    async function search() {
        const videos = (await window.videoApi.getYoutubeResult(query)).map(
            (video) => new VideoDTO(video)
        );
        setVideos(videos);
    }

    const onChange: FormEventHandler<HTMLInputElement> = (event) => {
        setQuery(event.currentTarget.value);
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === "Enter") {
            searchButton.current?.click();
        }
    };

    return (
        <>
            {!hidden && (
                <div className="z-10 relative h-full flex flex-col items-center">
                    <div className="flex my-10 w-1/3">
                        <input
                            className="grow outline-none p-1 border-2 rounded-l border-neutral-700 bg-neutral-400 placeholder-gray-500"
                            value={query}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            type="search"
                        />
                        <button
                            ref={searchButton}
                            className="p-1 border-2 rounded-r border-neutral-700 bg-neutral-700"
                            onClick={search}
                        >
                            <MagnifyingGlassIcon className="h-4 stroke-current stroke-1 text-neutral-200" />
                        </button>
                    </div>

                    {videos.length ? (
                        <VideoResult
                            key={videos.reduce(
                                (acc, curr) => acc + curr.id,
                                ""
                            )}
                            videos={videos}
                        />
                    ) : (
                        <div className="-z-10 grow flex flex-col justify-center items-center text-neutral-400">
                            <div className="absolute inset-0 flex flex-col justify-center items-center">
                                <div className="relative">
                                    <ArrowLongUpIcon className="animate-bounce-slow left-1/2 -translate-x-1/2 bottom-20 absolute h-20 stroke-current stroke-[0.01]" />
                                    <div>
                                        Enter a title or an URL in the search
                                        bar
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
