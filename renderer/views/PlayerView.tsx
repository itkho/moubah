import React from "react";
import ReactPlayer from "react-player";
import PlayerPlaceHolder from "../components/PlayerPlaceHolder";

import { usePlayer } from "../context/PlayerContext";
import { cleanSrcPath } from "../utils/helpers";

export default function PlayerView({ hidden }: { hidden: boolean }) {
    window.mainApi.log("debug", "PlayerView rendered!");
    console.log("PlayerView rendered!");

    const { video } = usePlayer();

    return (
        <>
            {!hidden && (
                <>
                    {video?.videoUri ? (
                        <div className="p-10">
                            <div>{video?.title}</div>
                            <div>{video?.author?.name}</div>
                            {/* <ReactPlayer
                                controls
                                volume={0}
                                url="https://www.youtube.com/watch?v=XqpFCuPAEPo"
                            /> */}
                            <ReactPlayer
                                controls
                                url={cleanSrcPath(video?.videoUri)}
                            />
                        </div>
                    ) : (
                        <PlayerPlaceHolder />
                    )}
                </>
            )}
        </>
    );
}
