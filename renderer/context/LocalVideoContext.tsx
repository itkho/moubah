import React, { createContext, ReactNode, useContext, useState } from "react";
import VideoDTO from "../../main/dto/video";

const LocalVideoContext = createContext(
    {} as {
        localVideos: VideoDTO[];
        setLocalVideos: (videos: VideoDTO[]) => void;
        localVideoIds: string[];
        addLocalVideo: (video: VideoDTO) => void;
        removeLocalVideo: (video: VideoDTO) => void;
    }
);

export function useLocalVideo() {
    return useContext(LocalVideoContext);
}

export function LocalVideoProvider(props: { children: ReactNode }) {
    const [localVideos, setLocalVideos] = useState<VideoDTO[]>([]);

    const localVideoIds = localVideos.map((video) => video.id);

    function addLocalVideo(video: VideoDTO) {
        setLocalVideos((currLocalVideos) => [video, ...currLocalVideos]);
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
                setLocalVideos,
                localVideoIds,
                addLocalVideo,
                removeLocalVideo,
            }}
        >
            {props.children}
        </LocalVideoContext.Provider>
    );
}
