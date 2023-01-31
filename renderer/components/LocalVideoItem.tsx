import React from "react";

import { TrashIcon } from "@heroicons/react/24/solid";
import VideoDTO from "../../main/dto/video";
import { abbrNum, cleanSrcPath } from "../utils/helpers";
import { useLocalVideo } from "../context/LocalVideoContext";
import { usePlayer } from "../context/PlayerContext";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
// TODO: move this in a shared folder (there is others too)
import { VideoStatus } from "../../main/utils/enum";

export default function LocalVideoItem({ video }: { video: VideoDTO }) {
    const { setView } = useView();
    const { removeLocalVideo } = useLocalVideo();
    const { updateVideo } = usePlayer();

    function removeVideo() {
        removeLocalVideo(video);
        window.videoApi.delete(video.id);
    }

    function playVideo() {
        if (video.status !== VideoStatus.done) return;
        updateVideo(video);
        setView(View.player);
    }

    return (
        <div className="my-4 flex h-28 items-center justify-between">
            <div
                className={`flex h-full ${
                    video.status === VideoStatus.done
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                }`}
                onClick={playVideo}
            >
                <img
                    className="aspect-video h-full"
                    src={cleanSrcPath(video.thumbnailUri)}
                    alt="Thumbnail"
                />
                <div className="grow p-2">
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {video.title}
                    </div>
                    <div>
                        Duration: {video.timestamp} | Views:{" "}
                        {abbrNum(video.views!)}
                    </div>
                    <div>Author: {video.author!.name}</div>
                    <div>
                        Status: {video.status}
                        {video.status === VideoStatus.processing
                            ? ` (${video.progress}%)`
                            : ""}
                    </div>
                </div>
            </div>
            <TrashIcon
                className="h-6 shrink-0 cursor-pointer"
                onClick={removeVideo}
            />
        </div>
    );
}
