import React, { createContext, ReactNode, useContext, useState } from "react";
import VideoDTO from "../../main/dto/video";

const PlayerContext = createContext(
    {} as {
        video?: VideoDTO;
        updateVideo: (video: VideoDTO) => void;
    }
);

export function usePlayer() {
    return useContext(PlayerContext);
}

export function PlayerProvider(props: { children: ReactNode }) {
    const [video, setVideo] = useState<VideoDTO>();

    function updateVideo(video: VideoDTO) {
        window.videoApi.setPlayed(video.id);
        setVideo(video);
    }

    return (
        <PlayerContext.Provider
            value={{
                video,
                updateVideo,
            }}
        >
            {props.children}
        </PlayerContext.Provider>
    );
}
