import React, { useEffect } from "react";
import VideoDTO from "../../main/dto/video";
import LocalVideoItem from "../components/LocalVideoItem";
import { useLocalVideo } from "../context/LocalVideoContext";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

export let updateLocalVideo: (videoUpdated: VideoDTO) => void;

export default function LibraryView({ hidden }: { hidden: boolean }) {
    window.mainApi.log("debug", "LibraryView rendered!");
    console.log("LibraryView rendered!");

    const { localVideos, setLocalVideos } = useLocalVideo();
    const { setView } = useView();

    updateLocalVideo = (videoUpdated) => {
        setLocalVideos(
            localVideos.map((video) =>
                video.id === videoUpdated.id ? videoUpdated : video
            )
        );
    };

    useEffect(() => {
        window.videoApi.getAll().then((videos) => {
            setLocalVideos(videos);
        });
    }, [hidden]);

    return (
        <>
            {!hidden && (
                <>
                    {localVideos.length ? (
                        <div className="h-80 mx-2 my-10 px-8 overflow-auto">
                            {localVideos.map((video) => (
                                <React.Fragment key={video.id}>
                                    <LocalVideoItem video={video} />
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full w-full flex flex-col justify-center text-center text-neutral-400 gap-10">
                            <div>No video to watch yet...</div>
                            <span>
                                Search for a video in the
                                <button
                                    className="bg-neutral-300 hover:bg-neutral-400 hover:text-neutral-300 rounded p-1 m-1"
                                    onClick={() => setView(View.search)}
                                >
                                    Search
                                </button>
                                section
                            </span>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
