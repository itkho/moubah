import React, { createContext, ReactNode, useContext, useState } from "react";
import VideoDTO from "../../main/dto/video";

const LocalVideoContext = createContext(
    {} as {
        localVideos: VideoDTO[];
        setLocalVideos: (videos: VideoDTO[]) => void;
        addLocalVideo: (video: VideoDTO) => void;
        removeLocalVideo: (video: VideoDTO) => void;
        selectedVideos: VideoDTO[];
        addToSelectedVideos: (videos: VideoDTO[]) => void;
        removeFromSelectedVideos: (video: VideoDTO) => void;
        unselectAllVideos: () => void;
    }
);

export function useLocalVideo() {
    return useContext(LocalVideoContext);
}

export function LocalVideoProvider(props: { children: ReactNode }) {
    const [localVideos, setLocalVideos] = useState<VideoDTO[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<VideoDTO[]>([]);

    function addLocalVideo(video: VideoDTO) {
        setLocalVideos((currLocalVideos) => [video, ...currLocalVideos]);
    }

    function removeLocalVideo(video: VideoDTO) {
        removeFromSelectedVideos(video);
        setLocalVideos((currLocalVideos) =>
            currLocalVideos.filter((localVideo) => localVideo.id !== video.id)
        );
    }

    function addToSelectedVideos(videos: VideoDTO[]) {
        // Remove already existing items
        const filteredVideos = videos.filter((video) => {
            return !selectedVideos.includes(video);
        });
        setSelectedVideos((currSelectedVideos) => [
            ...filteredVideos,
            ...currSelectedVideos,
        ]);
    }

    function removeFromSelectedVideos(video: VideoDTO) {
        setSelectedVideos((currSelectedVideos) =>
            currSelectedVideos.filter(
                (selectedVideo) => selectedVideo.id !== video.id
            )
        );
    }

    function unselectAllVideos() {
        setSelectedVideos([]);
    }

    return (
        <LocalVideoContext.Provider
            value={{
                localVideos,
                setLocalVideos,
                addLocalVideo,
                removeLocalVideo,
                selectedVideos,
                addToSelectedVideos,
                removeFromSelectedVideos,
                unselectAllVideos,
            }}
        >
            {props.children}
        </LocalVideoContext.Provider>
    );
}
