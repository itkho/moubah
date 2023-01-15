import React, { createContext, ReactNode, useContext, useState } from "react";
import VideoDTO from "../../main/dto/video";
import VideoResultDTO from "../../main/dto/video-result";

const LocalVideoContext = createContext(
    {} as {
        localVideos: VideoDTO[];
        localVideoIds: string[];
        addLocalVideo: (video: VideoResultDTO) => void;
        removeLocalVideo: (video: VideoDTO) => void;
    }
);

export function useLocalVideo() {
    return useContext(LocalVideoContext);
}

export function LocalVideoProvider(props: { children: ReactNode }) {
    const [localVideos, setLocalVideos] = useState<VideoDTO[]>([]);

    const localVideoIds = localVideos.map((video) => video.id);

    function addLocalVideo(video: VideoResultDTO) {
        setLocalVideos((currLocalVideos) => [
            video.toVideoDTO(),
            ...currLocalVideos,
        ]);
    }

    function removeLocalVideo(video: VideoDTO) {
        setLocalVideos((currLocalVideos) =>
            currLocalVideos.filter((localVideo) => localVideo.id != video.id)
        );
    }

    return (
        <LocalVideoContext.Provider
            value={{
                localVideos,
                localVideoIds,
                addLocalVideo,
                removeLocalVideo,
            }}
        >
            {props.children}
        </LocalVideoContext.Provider>
    );
}
