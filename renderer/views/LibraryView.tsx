import React, { useEffect } from "react";
import VideoDTO from "../../main/dto/video";
import LocalVideoItem from "../components/LocalVideoItem";
import { useLocalVideo } from "../context/LocalVideoContext";

export let updateLocalVideo: (videoUpdated: VideoDTO) => void;

export default function LibraryView({ hidden }: { hidden: boolean }) {
    console.log("LibraryView mounted!");

    const { localVideos, setLocalVideos } = useLocalVideo();

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
                <div className="h-80 mx-2 my-10 px-8 overflow-auto">
                    {localVideos.length ? (
                        localVideos.map((video) => (
                            <React.Fragment key={video.id}>
                                <LocalVideoItem video={video} />
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="text-center">
                            No video to watch yet...
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
