import React from "react";

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

export default function SearchResult({
    videos,
    videoIndex,
    prevVideo,
    nextVideo,
}: {
    videos: VideoDTO[];
    videoIndex: number;
    prevVideo: () => void;
    nextVideo: () => void;
}) {
    window.mainApi.log("debug", "VideoResult rendered!");

    const { setView } = useView();
    const { updateVideo } = usePlayer();
    const { localVideos, addLocalVideo } = useLocalVideo();
    const [modelShown, setModelShown] = React.useState(false);

    const currVideo = videos[videoIndex];
    let currLocalVideo = localVideos.find(
        (localVideo) => localVideo.id === currVideo.id
    );

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
        <>
            <div className="flex w-full shrink grow flex-col items-center justify-evenly">
                {/* Carousel */}
                <div className="flex w-full shrink items-center justify-evenly">
                    <ArrowLeftIcon
                        className={`m-5 h-10 shrink-0 cursor-pointer ${
                            videoIndex === 0
                                ? "text-base-400 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={prevVideo}
                    />
                    <div className="flex max-w-lg shrink flex-col">
                        <div className="h-12 line-clamp-2">
                            {currVideo.title}
                        </div>
                        <img
                            className="my-5 aspect-video shrink rounded-lg shadow-xl ring-2 ring-neutral-400 ring-opacity-30"
                            src={currVideo.thumbnailUri}
                            alt="Thumbnail"
                        />
                        <div>
                            Duration: {currVideo.timestamp} | Views:{" "}
                            {abbrNum(currVideo.views)}
                        </div>
                        <div>Author: {currVideo.author.name}</div>
                    </div>
                    <ArrowRightIcon
                        className={`m-5 h-10 shrink-0 cursor-pointer ${
                            videoIndex === videos.length - 1
                                ? "text-base-400 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={nextVideo}
                    />
                </div>
            </div>
            {/* Buttons */}
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
        </>
    );
}
