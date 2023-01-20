import React from "react";

import { usePlayer } from "../context/PlayerContext";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { cleanSrcPath } from "../utils/helpers";

export default function PlayerView({ hidden }: { hidden: boolean }) {
    console.log("PlayerView mounted!");

    const { video } = usePlayer();
    const { setView } = useView();

    return (
        <>
            {!hidden && (
                <>
                    {video?.videoUri ? (
                        <div className="p-10">
                            <div>{video?.title}</div>
                            <div>{video?.author?.name}</div>
                            <video controls>
                                <source src={cleanSrcPath(video?.videoUri)} />
                            </video>
                        </div>
                    ) : (
                        <div className="h-full w-full flex flex-col justify-center text-center text-neutral-400">
                            <span>
                                Select a video in the
                                <button
                                    className="bg-neutral-300 hover:bg-neutral-400 hover:text-neutral-300 rounded p-1 m-1"
                                    onClick={() => setView(View.library)}
                                >
                                    Library
                                </button>
                            </span>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
