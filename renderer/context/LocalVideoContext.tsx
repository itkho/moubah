import React, { createContext, ReactNode, useContext, useState } from "react";
import VideoDTO from "../../main/dto/video";

const LocalVideoContext = createContext(
    {} as {
        localVideos: VideoDTO[];
        setLocalVideos: (videos: VideoDTO[]) => void;
        addLocalVideo: (video: VideoDTO) => void;
        removeLocalVideo: (video: VideoDTO) => void;
        selectedVideos: VideoDTO[];
        addToSelectedVideos: (video: VideoDTO) => void;
        removeFromSelectedVideos: (video: VideoDTO) => void;
        toggleSelectAllVideos: () => void;
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
            currLocalVideos.filter((localVideo) => localVideo.id != video.id)
        );
    }

    function addToSelectedVideos(video: VideoDTO) {
        setSelectedVideos((currSelectedVideos) => [
            video,
            ...currSelectedVideos,
        ]);
    }

    function removeFromSelectedVideos(video: VideoDTO) {
        setSelectedVideos((currSelectedVideos) =>
            currSelectedVideos.filter(
                (selectedVideo) => selectedVideo.id != video.id
            )
        );
    }

    function toggleSelectAllVideos() {
        if (localVideos.length === selectedVideos.length) {
            setSelectedVideos([]);
        } else {
            setSelectedVideos(localVideos);
        }
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
                toggleSelectAllVideos,
            }}
        >
            {props.children}
        </LocalVideoContext.Provider>
    );
}
