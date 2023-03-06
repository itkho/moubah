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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEye } from "@fortawesome/free-regular-svg-icons";

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
    const { setView } = useView();
    const { updateVideo } = usePlayer();
    const { localVideos, addLocalVideo } = useLocalVideo();
    const [modelShown, setModelShown] = React.useState(false);

    const currVideo = videos[videoIndex];
    let currLocalVideo = localVideos.find(
        (localVideo) => localVideo.id === currVideo.id
    );

    function onClickPrimary() {
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

    function getPrimaryButtonText(
        status?: VideoStatus,
        withEmoji: boolean = true
    ) {
        let text: string;
        let emoji: string;

        switch (status) {
            case VideoStatus.done:
                text = t`Background music removed`;
                emoji = "✅";
                break;
            case VideoStatus.processing:
                text = t`Removing background music...`;
                emoji = "⚙️";
                break;
            case VideoStatus.downloading:
            case VideoStatus.initial:
                text = t`Downloading the video...`;
                emoji = "📥";
                break;
            default:
                text = t`Remove background music`;
                emoji = "🔇";
                break;
        }
        if (withEmoji) text = `${emoji} ${text}`;
        return text;
    }

    return (
        <>
            <div className="flex h-full w-full flex-col">
                {/* Carousel */}
                <div className="flex grow items-center justify-evenly">
                    <ArrowLeftIcon
                        className={`m-8 h-10 shrink-0 cursor-pointer ${
                            videoIndex === 0
                                ? "text-base-400 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={prevVideo}
                    />

                    <div className="flex h-full max-w-lg shrink grow flex-col items-center justify-center">
                        <div className="flex aspect-square h-full max-w-full flex-col justify-center">
                            <div className="ring-base-500 relative my-3 w-full overflow-hidden rounded-lg shadow-xl ring-1 ring-opacity-50">
                                <div
                                    className="aspect-video w-full bg-contain bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${currVideo.thumbnailUri})`,
                                    }}
                                ></div>
                                {/* Video corner info */}
                                <div className="border-base-100 bg-base-800 text-base-100 absolute bottom-0 right-0 rounded-tl border-t-2 border-l-2 p-1 opacity-70">
                                    <div className="divide-base-100 flex divide-x-2 text-sm">
                                        <div className="px-1">
                                            <FontAwesomeIcon
                                                icon={faClock}
                                                className="pr-2"
                                            />
                                            {currVideo.timestamp}
                                        </div>
                                        <div className="px-1">
                                            <FontAwesomeIcon
                                                icon={faEye}
                                                className="pr-2"
                                            />
                                            {abbrNum(currVideo.views!)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="my-2  text-lg line-clamp-1 hover:text-clip">
                                {currVideo.title}
                            </div>

                            <div className="my-2 text-sm">
                                <Trans>By:</Trans> {currVideo.author.name}
                            </div>
                        </div>
                    </div>
                    <ArrowRightIcon
                        className={`m-8 h-10 shrink-0 cursor-pointer ${
                            videoIndex === videos.length - 1
                                ? "text-base-400 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={nextVideo}
                    />
                </div>

                {/* Buttons */}
                <div className="my-10 flex shrink-0 grow-0 flex-col items-center">
                    <button
                        className="text-base-600 hover:text-base-700 decoration-highlight mb-2 text-sm hover:underline"
                        onClick={() => setModelShown(true)}
                    >
                        <Trans>Preview the video</Trans>
                    </button>
                    <button
                        onClick={onClickPrimary}
                        className={
                            `rounded p-2  ring-1 ` +
                            (currLocalVideo?.status &&
                            [
                                VideoStatus.initial,
                                VideoStatus.downloading,
                                VideoStatus.processing,
                            ].includes(currLocalVideo.status)
                                ? "bg-base-300 ring-base-400 hover:bg-base-400 text-base-800"
                                : "bg-highlight ring-highlight-hover hover:bg-highlight-hover text-base-100-light")
                        }
                    >
                        {getPrimaryButtonText(currLocalVideo?.status)}
                    </button>
                </div>
                {modelShown && (
                    <PreviewModal
                        setShowModal={setModelShown}
                        video={currVideo}
                        primaryButtonText={getPrimaryButtonText(
                            currLocalVideo?.status,
                            false
                        )}
                        onClickPrimary={onClickPrimary}
                    />
                )}
            </div>
        </>
    );
}
