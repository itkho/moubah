import React from "react";

import { TrashIcon } from "@heroicons/react/24/solid";
import VideoDTO from "../../main/dto/video";
import { abbrNum, cleanSrcPath } from "../utils";
import { useLocalVideo } from "../context/LocalVideoContext";
import { usePlayer } from "../context/PlayerContext";
import { useView } from "../context/ViewContext";
import { View } from "../enums";

export default function LocalVideoItem({ video }: { video: VideoDTO }) {
    const { setView } = useView();
    const { removeLocalVideo } = useLocalVideo();
    const { updateVideo } = usePlayer();

    function removeVideo() {
        removeLocalVideo(video);
        window.videoApi.delete(video.id);
    }

    function playVideo() {
        updateVideo(video);
        setView(View.player);
    }

    return (
        <div className="flex my-4 h-28 items-center justify-between">
            <div className="h-full flex" onClick={playVideo}>
                <img
                    className="aspect-video h-full"
                    src={cleanSrcPath(video.thumbnailUri)}
                    alt="Thumbnail"
                />
                <div className="grow p-3">
                    {video.title} <br />
                    Duration: {video.timestamp} | Views: {abbrNum(video.views!)}
                    <br />
                    Author: {video.author!.name}
                </div>
            </div>
            <TrashIcon className="h-6 shrink-0" onClick={removeVideo} />
        </div>
    );
}
