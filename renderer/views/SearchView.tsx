import React, {
    FormEventHandler,
    KeyboardEventHandler,
    useEffect,
    useRef,
    useState,
} from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import SearchResult from "../components/SearchResult";
import VideoDTO from "../../main/dto/video";
import SearchPlaceHolder from "../components/SearchPlaceHolder";

export default function SearchView({ hidden }: { hidden: boolean }) {
    const [videos, setVideos] = useState<VideoDTO[]>([]);
    const [query, setQuery] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);

    const searchButton = useRef<HTMLButtonElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);

    async function search() {
        const videos = (await window.videoApi.getYoutubeResult(query)).map(
            (video) => new VideoDTO(video)
        );
        searchInput.current?.blur();
        setVideos(videos);
        setVideoIndex(0);
    }

    const onChange: FormEventHandler<HTMLInputElement> = (event) => {
        setQuery(event.currentTarget.value);
    };

    const onSearchKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === "Enter") {
            searchButton.current?.click();
        }
    };

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

    function handleKeyDown(event: KeyboardEvent) {
        if (document.activeElement === searchInput.current) return;
        if (event.key === "ArrowLeft") prevVideo();
        if (event.key === "ArrowRight") nextVideo();
    }

    useEffect(() => {
        if (!hidden && videos.length > 0) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [hidden, videos, videoIndex]);

    return (
        <>
            {!hidden && (
                <div className="relative z-10 flex h-full w-full flex-col items-center">
                    <div className="group my-10 flex w-1/3">
                        <input
                            ref={searchInput}
                            className="border-base-600 bg-base-300 group-focus-within:border-highlight grow rounded-l border-2 border-r-0 px-2 py-1 outline-none"
                            value={query}
                            onChange={onChange}
                            onKeyDown={onSearchKeyDown}
                            type="text"
                            autoFocus
                        />
                        <button
                            ref={searchButton}
                            className="group-focus-within:border-highlight border-base-600 bg-base-600 rounded-r border-2 border-l-0 p-1"
                            onClick={search}
                        >
                            <MagnifyingGlassIcon className="text-base-200 h-4 stroke-current stroke-1 px-2" />
                        </button>
                    </div>

                    {videos.length ? (
                        <SearchResult
                            key={videos.reduce(
                                (acc, curr) => acc + curr.id,
                                ""
                            )}
                            videos={videos}
                            videoIndex={videoIndex}
                            prevVideo={prevVideo}
                            nextVideo={nextVideo}
                        />
                    ) : (
                        <SearchPlaceHolder />
                    )}
                </div>
            )}
        </>
    );
}
