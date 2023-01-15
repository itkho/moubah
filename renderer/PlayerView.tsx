import React from "react";

import { usePlayer } from "./context/PlayerContext";

export default function PlayerView({ hidden }: { hidden: boolean }) {
    console.log("PlayerView mounted!");

    const { video } = usePlayer();

    return (
        <>
            {!hidden && (
                <div className="m-10">
                    {/* {true ? ( */}
                    {video ? (
                        <>
                            <div>{video?.title}</div>
                            <div>{video?.author?.name}</div>
                            <video controls>
                                {/* <source src={`file://${video?.videoUri}`} /> */}
                                <source src="./assets/video.mp4" />
                            </video>
                        </>
                    ) : (
                        <div className="text-center">
                            Select a video in the "Library"
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
