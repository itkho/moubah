import React, { Fragment } from "react";
import {
    faEllipsis,
    faTrash,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";

import VideoDTO from "../../main/dto/video";
import { abbrNum, capitalizeFirstLetter, cleanSrcPath } from "../utils/helpers";
import { useLocalVideo } from "../context/LocalVideoContext";
import { usePlayer } from "../context/PlayerContext";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
// TODO: move this in a shared folder (there is others too)
import { VideoStatus } from "../../main/utils/enum";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCirclePause,
    faCircleStop,
    faCirclePlay,
    faCircleDown,
    faClock,
    faEye,
    faFolderOpen,
    faPlayCircle,
} from "@fortawesome/free-regular-svg-icons";
import { Trans, t } from "@lingui/macro";

const isMac = await window.mainApi.isMac();

function transVideoStatus(videoStatus: VideoStatus) {
    let text: string;
    switch (videoStatus) {
        case VideoStatus.initial:
            text = t`initial`;
            break;
        case VideoStatus.downloading:
            text = t`downloading`;
            break;
        case VideoStatus.processing:
            text = t`processing`;
            break;
        case VideoStatus.done:
            text = t`done`;
            break;
    }
    return capitalizeFirstLetter(text);
}

export default function LibraryVideoItem({
    video,
    selected,
    removeVideos,
    pauseProcessVideo,
    resumeProcessVideo,
}: {
    video: VideoDTO;
    selected: boolean;
    removeVideos: (videos: VideoDTO[]) => void;
    pauseProcessVideo: (video: VideoDTO) => void;
    resumeProcessVideo: (video: VideoDTO) => void;
}) {
    const { setView } = useView();
    const { addToSelectedVideos, removeFromSelectedVideos } = useLocalVideo();
    const { updateVideo } = usePlayer();

    function playVideo() {
        if (video.status !== VideoStatus.done) return;
        updateVideo(video);
        setView(View.player);
    }

    function handleCheckboxClick() {
        if (selected) {
            removeFromSelectedVideos(video);
        } else {
            addToSelectedVideos([video]);
        }
    }

    function getActionButton(active: boolean) {
        let action: (video: VideoDTO) => void;
        let text;
        let icon = faCirclePlay;

        switch (video.status) {
            case VideoStatus.initial:
            case VideoStatus.downloading:
                if (video.metadata?.isPending) {
                    text = t`Download`;
                    icon = faCircleDown;
                    action = resumeProcessVideo;
                } else {
                    text = t`Stop`;
                    icon = faCircleStop;
                    action = pauseProcessVideo;
                }
                break;
            case VideoStatus.processing:
                if (video.metadata?.isPending) {
                    text = t`Resume`;
                    icon = faVolumeXmark;
                    action = resumeProcessVideo;
                } else {
                    text = t`Pause`;
                    icon = faCirclePause;
                    action = pauseProcessVideo;
                }
                break;
            case VideoStatus.done:
                text = t`Play`;
                icon = faCirclePlay;
                action = playVideo;
                break;
        }

        return (
            <button
                className={`rounded-md p-1 text-left ${
                    active && "bg-base-300"
                }`}
                onClick={() => {
                    action(video);
                }}
            >
                <FontAwesomeIcon
                    icon={icon}
                    className="text-base-700 w-4 px-2"
                />
                {text}
            </button>
        );
    }

    return (
        <div className="max-w-30 ring-base-300 group/card relative flex-col rounded-md bg-base-100-light py-2 px-4 shadow-sm ring-2 hover:shadow-lg dark:bg-base-200-dark dark:shadow-none dark:hover:ring-base-400-dark">
            {video.metadata?.isNew && (
                <div className="bg-highlight absolute -top-2 left-4 -z-10 rounded-lg px-2 pt-1 pb-4 text-xs font-semibold uppercase text-base-100-light transition group-hover/card:-translate-y-4">
                    <Trans>new</Trans>
                </div>
            )}
            <div className="flex items-center justify-between pb-2">
                {/* Custom check box */}
                <div
                    className="border-base-400 bg-base-100 h-4 w-4 cursor-pointer rounded-md border-2 p-0.5"
                    onClick={handleCheckboxClick}
                >
                    <div
                        className={`h-full w-full rounded-sm ${
                            selected && "bg-lime-500"
                        }`}
                    ></div>
                </div>
                <Menu as="div" className="relative">
                    <Menu.Button className="hover:bg-base-300 flex rounded-md px-2 py-1">
                        <FontAwesomeIcon icon={faEllipsis} className="h-5" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="ring-base-800 divide-base-200 bg-base-100 absolute right-0 z-10 mt-1 w-52 divide-y rounded-md p-1 text-sm shadow-lg ring-[0.5px] focus:outline-none">
                            <div className="flex flex-col p-1">
                                <Menu.Item>
                                    {({ active }) => getActionButton(active)}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-base-300"
                                            }`}
                                        >
                                            <FontAwesomeIcon
                                                icon={faFolderOpen}
                                                className="text-base-700 w-4 px-2"
                                            />
                                            <Trans>Open in</Trans>
                                            {isMac ? " Finder" : " Explorer"}
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="flex flex-col p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-ko-500"
                                            }`}
                                            onClick={() =>
                                                removeVideos([video])
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="text-base-700 w-4 px-2"
                                            />
                                            <Trans>Delete</Trans>
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className="truncate text-lg">{video.title}</div>
            <div className="text-sm">
                <Trans>By:</Trans> {video.author!.name}
            </div>
            <div
                className={`ring-base-200 group relative my-2 overflow-hidden rounded-2xl ring-1 ${
                    video.status === VideoStatus.done
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                }`}
                onClick={playVideo}
            >
                <img
                    className="aspect-video duration-200 ease-in group-hover:scale-105"
                    src={cleanSrcPath(video.thumbnailUri)}
                    alt="Thumbnail"
                />
                <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="absolute top-1/2 left-1/2 h-10 -translate-x-1/2 -translate-y-1/2 text-base-100-light opacity-50 duration-200 ease-in group-hover:scale-125 group-hover:opacity-100 group-hover:drop-shadow-xl"
                />
                {/* Video corner info */}
                <div className="border-base-100 bg-base-800 text-base-100 absolute bottom-0 right-0 rounded-tl border-t-2 border-l-2 p-1 opacity-70">
                    <div className="divide-base-100 flex divide-x-2 text-sm">
                        <div className="px-1">
                            <FontAwesomeIcon icon={faClock} className="pr-2" />
                            {video.timestamp}
                        </div>
                        <div className="px-1">
                            <FontAwesomeIcon icon={faEye} className="pr-2" />
                            {abbrNum(video.views!)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="group/progress h-2 grow rounded-full bg-base-200-light dark:bg-base-600-light">
                    <div
                        className={`h-full rounded-full 
                        ${video.status === VideoStatus.done && "bg-highlight"}
                        ${
                            video.status === VideoStatus.processing &&
                            "bg-teal-500"
                        }
                        ${
                            video.status === VideoStatus.downloading &&
                            "bg-cyan-500"
                        }
                        }`}
                        style={{ width: `${video.progress}%` }}
                    ></div>
                </div>
                <div className="text-base-500 pl-2 text-right text-sm">
                    {video.metadata.isPending
                        ? capitalizeFirstLetter(t`pending`)
                        : transVideoStatus(video.status!)}
                </div>
            </div>
        </div>
    );
}
