import React, { useEffect, useState } from "react";

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { abbrNum } from "../utils/helpers";
import { useLocalVideo } from "../context/LocalVideoContext";
import VideoDTO from "../../main/dto/video";
import { VideoQuality, VideoStatus } from "../../main/utils/enum";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { usePlayer } from "../context/PlayerContext";
import PreviewModal from "./PreviewModal";
import { Trans, t } from "@lingui/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEye } from "@fortawesome/free-regular-svg-icons";
import { Listbox, Transition } from "@headlessui/react";

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
    const [modelShown, setModelShown] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(
        VideoQuality.p720
    );

    const currVideo = videos[videoIndex];
    let currLocalVideo = localVideos.find(
        (localVideo) => localVideo.id === currVideo.id
    );

    useEffect(() => {
        currVideo.quality = selectedQuality;
    }, [selectedQuality]);

    useEffect(() => {
        const updateSelectedQuality = async () => {
            const quality = await window.mainApi.getUserPrefQuality();
            setSelectedQuality(quality);
        };

        updateSelectedQuality();
    }, [currVideo]);

    async function onClickPrimary() {
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
        console.log({ video });

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
                            <div
                                className="ring-base-500 relative my-3 w-full cursor-pointer overflow-hidden rounded-lg shadow-xl ring-1 ring-opacity-50"
                                onClick={async () => setModelShown(true)}
                            >
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
                    {/* Preview button */}
                    <button
                        className="text-base-600 hover:text-base-700 decoration-highlight mb-2 text-sm hover:underline"
                        onClick={() => setModelShown(true)}
                    >
                        <Trans>Preview the video</Trans>
                    </button>
                    {/* Primary button */}
                    <div className="flex shadow-md">
                        <button
                            onClick={onClickPrimary}
                            className={
                                `rounded-l p-2 ring-1 ` +
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
                        <div className="w-28">
                            <Listbox
                                value={selectedQuality}
                                onChange={setSelectedQuality}
                            >
                                <div className="relative h-full">
                                    <Listbox.Button className="bg-highlight ring-highlight-hover hover:bg-highlight-hover relative  h-full w-full rounded-r p-2 text-center text-sm text-base-100-light ring-1">
                                        <span>{selectedQuality}</span>
                                        <span className="absolute  inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as="div"
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="bg-base-200 absolute bottom-full z-10 mb-1 w-full overflow-auto rounded-md py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                            {/* <div className="absolute bottom-full z-10 mb-4 w-full rounded-md bg-base-100-light py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-base-500-light"> */}
                                            <div className="relative">
                                                <Listbox.Options>
                                                    {Object.values(VideoQuality)
                                                        .reverse()
                                                        .map((quality) => {
                                                            return (
                                                                <Listbox.Option
                                                                    key={
                                                                        quality
                                                                    }
                                                                    className={({
                                                                        active,
                                                                    }) =>
                                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                                            active
                                                                                ? "bg-lime-100 text-lime-900"
                                                                                : "text-base-900"
                                                                        }`
                                                                    }
                                                                    value={
                                                                        quality
                                                                    }
                                                                >
                                                                    {({
                                                                        selected,
                                                                    }) => (
                                                                        <>
                                                                            <span
                                                                                className={`block truncate ${
                                                                                    selected
                                                                                        ? "font-medium"
                                                                                        : "font-normal"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    quality
                                                                                }
                                                                            </span>
                                                                            {selected && (
                                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lime-600">
                                                                                    <CheckIcon
                                                                                        className="h-5 w-5"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </Listbox.Option>
                                                            );
                                                        })}
                                                </Listbox.Options>
                                                <div className="clip-path-triangle absolute -bottom-[10px] left-1/2 h-3 w-3 -translate-x-1/2 -rotate-45 bg-base-100-light shadow-lg ring-1 ring-black dark:bg-base-500-light"></div>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                    </div>
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
