import React from "react";

import { usePlayer } from "../context/PlayerContext";
import { cleanSrcPath } from "../utils/helpers";

export default function PlayerView({ hidden }: { hidden: boolean }) {
    console.log("PlayerView mounted!");

    const { video } = usePlayer();

    return (
        <>
            {!hidden && (
                <div className="m-10">
                    {video?.videoUri ? (
                        <>
                            <div>{video?.title}</div>
                            <div>{video?.author?.name}</div>
                            <video controls>
                                <source src={cleanSrcPath(video?.videoUri)} />
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
