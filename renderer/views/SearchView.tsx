import React, {
    FormEventHandler,
    KeyboardEventHandler,
    useRef,
    useState,
} from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import VideoResult from "../components/VideoResult";
import VideoDTO from "../../main/dto/video";
import SearchPlaceHolder from "../components/SearchPlaceHolder";

export default function SearchView({ hidden }: { hidden: boolean }) {
    window.mainApi.log("debug", "SearchView rendered!");

    const [videos, setVideos] = useState<VideoDTO[]>([]);
    const [query, setQuery] = useState("");
    const searchButton = useRef<HTMLButtonElement>(null);

    async function search() {
        const videos = (await window.videoApi.getYoutubeResult(query)).map(
            (video) => new VideoDTO(video)
        );
        window.mainApi.log("debug", `video: ${videos[0]}`);
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
                <div className="relative z-10 flex h-full flex-col items-center">
                    <div className="my-10 flex w-1/3">
                        <input
                            className="grow rounded-l border-2 border-neutral-700 bg-neutral-300 px-2 py-1 outline-none"
                            value={query}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            type="text"
                            autoFocus
                        />
                        <button
                            ref={searchButton}
                            className="rounded-r border-2 border-neutral-700 bg-neutral-700 p-1"
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
                        <SearchPlaceHolder />
                    )}
                </div>
            )}
        </>
    );
}
