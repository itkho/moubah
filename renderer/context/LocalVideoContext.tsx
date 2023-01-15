import React, { createContext, ReactNode, useContext, useState } from "react";
import VideoDTO from "../../main/dto/video";
import VideoResultDTO from "../../main/dto/video-result";

const LocalVideoContext = createContext(
    {} as {
        localVideos: VideoDTO[];
        localVideoIds: string[];
        addLocalVideos: (video: VideoResultDTO) => void;
    }
);

export function useLocalVideo() {
    return useContext(LocalVideoContext);
}

export function LocalVideoProvider(props: { children: ReactNode }) {
    const [localVideos, setLocalVideos] = useState<VideoDTO[]>([]);

    const localVideoIds = localVideos.map((video) => video.id);

    function addLocalVideos(video: VideoResultDTO) {
        console.log({ video });
        console.log(video.id);
        console.log(video.test());
        console.log(video.toVideoDTO());

        setLocalVideos((currLocalVideos) => [
            ...currLocalVideos,
            video.toVideoDTO(),
        ]);
    }

    return (
        <LocalVideoContext.Provider
            value={{ localVideos, localVideoIds, addLocalVideos }}
        >
            {props.children}
        </LocalVideoContext.Provider>
    );
}
