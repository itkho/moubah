import React, { useState } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { abbrNum } from "../utils/helpers";
import { useLocalVideo } from "../context/LocalVideoContext";
import VideoDTO from "../../main/dto/video";
import { VideoStatus } from "../../main/utils/enum";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { usePlayer } from "../context/PlayerContext";
import PreviewModal from "./PreviewModal";
import { Trans, t } from "@lingui/macro";

export default function SearchResult({ videos }: { videos: VideoDTO[] }) {
    window.mainApi.log("debug", "VideoResult rendered!");

    const { setView } = useView();
    const { updateVideo } = usePlayer();
    const { localVideos, addLocalVideo } = useLocalVideo();
    const [videoIndex, setVideoIndex] = useState(0);
    const [modelShown, setModelShown] = React.useState(false);

    const currVideo = videos[videoIndex];
    let currLocalVideo = localVideos.find(
        (localVideo) => localVideo.id === currVideo.id
    );

    function prevVideo() {
        if (videoIndex - 1 >= 0) {
            setVideoIndex((currVideoIndex) => currVideoIndex - 1);
        }
    }

    function nextVideo() {
        if (videoIndex + 1 <= videos.length - 1) {
            setVideoIndex((currVideoIndex) => currVideoIndex + 1);
        }
    }

    function onClickThumbnail() {
        switch (currLocalVideo?.status) {
            case VideoStatus.done:
                updateVideo(currLocalVideo);
                setView(View.player);
                break;
            case VideoStatus.processing:
            case VideoStatus.downloading:
            case VideoStatus.initial:
                setView(View.library);
                break;
            default:
                removeMusic();
                break;
        }
    }

    function removeMusic() {
        const video = currVideo;
        window.videoApi.sendToDownload(video);
        addLocalVideo(video);
    }

    function renderButtonContent(status?: VideoStatus) {
        switch (status) {
            case VideoStatus.done:
                return "✅ " + t`Background music removed`;
            case VideoStatus.processing:
                return "⚙️ " + t`Removing background music...`;
            case VideoStatus.downloading:
            case VideoStatus.initial:
                return "📥 " + t`Downloading the video...`;
            default:
                return "🔇 " + t`Remove background music`;
        }
    }

    return (
        <div className="flex grow flex-col items-center justify-evenly">
            <div className="flex items-center">
                <div>
                    <ArrowLeftIcon
                        className={`m-20 h-10 cursor-pointer ${
                            videoIndex === 0
                                ? "text-base-400 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={prevVideo}
                    />
                </div>
                <div className="basis-4/6">
                    <div className="h-12 line-clamp-2">{currVideo.title}</div>
                    <img
                        className="my-5 aspect-video rounded-lg shadow-xl"
                        src={currVideo.thumbnailUri}
                        alt="Thumbnail"
                    />
                    <div>
                        Duration: {currVideo.timestamp} | Views:{" "}
                        {abbrNum(currVideo.views)}
                    </div>
                    <div>Author: {currVideo.author.name}</div>
                </div>
                <div>
                    <ArrowRightIcon
                        className={`m-20 h-10 cursor-pointer ${
                            videoIndex === videos.length - 1
                                ? "text-base-400 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={nextVideo}
                    />
                </div>
            </div>
            <div className="my-10 flex flex-col items-center">
                <button
                    className="text-base-600 hover:text-base-700 m-1 hover:underline"
                    onClick={() => setModelShown(true)}
                >
                    <Trans>Preview the video</Trans>
                </button>
                <button
                    onClick={onClickThumbnail}
                    className={
                        "bg-base-400 hover:bg-base-700 hover:text-base-400 rounded p-3"
                    }
                >
                    {renderButtonContent(currLocalVideo?.status)}
                </button>
            </div>
            {modelShown && (
                <PreviewModal setShowModal={setModelShown} video={currVideo} />
            )}
        </div>
    );
}
