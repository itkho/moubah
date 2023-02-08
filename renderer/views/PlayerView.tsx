import React, { KeyboardEventHandler, RefObject, useRef } from "react";
import ReactPlayer from "react-player";
import PlayerPlaceHolder from "../components/PlayerPlaceHolder";

import { usePlayer } from "../context/PlayerContext";
import { cleanSrcPath } from "../utils/helpers";

export default function PlayerView({ hidden }: { hidden: boolean }) {
    window.mainApi.log("debug", "PlayerView rendered!");
    console.log("PlayerView rendered!");

    const { video } = usePlayer();
    const player = useRef<ReactPlayer>(null);

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        console.log("onKeyDown");
        let shift = 0;
        switch (event.key) {
            case "ArrowRight":
                shift = +5;
                break;
            case "ArrowLeft":
                shift = -5;
                break;
            default:
                return;
        }
        console.log(shift);
        player.current?.seekTo(
            player.current?.getCurrentTime() + shift,
            "seconds"
        );
    };

    return (
        <>
            {!hidden && (
                <>
                    {video?.videoUri ? (
                        <div className="flex flex-col p-10">
                            <div className="my-4">
                                <h1 className="text-3xl font-semibold">
                                    {video?.title}
                                </h1>
                                <h3 className="text-xl font-light">
                                    {video?.author?.name}
                                </h3>
                            </div>
                            {/* TODO: https://code.pieces.app/blog/developing-a-react-video-player-with-personalized-controls#:~:text=Watch%20Now-,Handling%20the%20Rewind%20and%20Fast%20Forward%20functionalities,-. */}
                            <div
                                className="overflow-hidden rounded-lg ring-2 ring-neutral-500"
                                onKeyDown={onKeyDown}
                            >
                                <ReactPlayer
                                    ref={player}
                                    controls
                                    url={cleanSrcPath(video?.videoUri)}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        </div>
                    ) : (
                        <PlayerPlaceHolder />
                    )}
                </>
            )}
        </>
    );
}
