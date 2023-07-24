import React, {
    createContext,
    MutableRefObject,
    ReactNode,
    useContext,
    useRef,
    useState,
} from "react";
import VideoDTO from "../../main/dto/video";

const PlayerContext = createContext(
    {} as {
        video?: VideoDTO;
        updateVideo: (video: VideoDTO) => void;
        // autoplay?: boolean;
        // setAutoplay: (autoplay: boolean) => void;
        autoplay: MutableRefObject<boolean>;
    }
);

export function usePlayer() {
    return useContext(PlayerContext);
}

export function PlayerProvider(props: { children: ReactNode }) {
    const [video, setVideo] = useState<VideoDTO>();
    // const [autoplay, setAutoplay] = useState(false);
    const autoplay = useRef(false);

    function updateVideo(video: VideoDTO) {
        window.videoApi.setPlayed(video.id);
        setVideo(video);
    }

    return (
        <PlayerContext.Provider
            value={{
                video,
                updateVideo,
                // autoplay,
                // setAutoplay,
                autoplay,
            }}
        >
            {props.children}
        </PlayerContext.Provider>
    );
}
