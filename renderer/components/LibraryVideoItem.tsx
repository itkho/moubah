import React, { Fragment } from "react";
import { faEllipsis, faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";

import VideoDTO from "../../main/dto/video";
import { abbrNum, cleanSrcPath } from "../utils/helpers";
import { useLocalVideo } from "../context/LocalVideoContext";
import { usePlayer } from "../context/PlayerContext";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
// TODO: move this in a shared folder (there is others too)
import { VideoStatus } from "../../main/utils/enum";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faEye,
    faFolderOpen,
    faPlayCircle,
} from "@fortawesome/free-regular-svg-icons";
import { Trans, t } from "@lingui/macro";

function transVideoStatus(videoStatus: VideoStatus) {
    switch (videoStatus) {
        case VideoStatus.initial:
            return t`initial`;
        case VideoStatus.downloading:
            return t`downloading`;
        case VideoStatus.processing:
            return t`processing`;
        case VideoStatus.done:
            return t`done`;
    }
}

export default function LibraryVideoItem({
    video,
    selected,
    removeVideos,
}: {
    video: VideoDTO;
    selected: boolean;
    removeVideos: (videos: VideoDTO[]) => void;
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

    return (
        <div className="max-w-30 ring-base-300 group/card relative flex-col rounded-md bg-base-100-light py-2 px-4 shadow-sm ring-2 hover:shadow-lg dark:bg-base-200-dark dark:shadow-none dark:hover:ring-base-400-dark">
            {video.metadata?.isNew && (
                <div className="bg-highlight absolute -top-2 left-4 -z-10 rounded-lg px-2 pt-1 pb-4 text-xs font-semibold uppercase transition group-hover/card:-translate-y-4">
                    new
                </div>
            )}
            <div className="flex items-center justify-between pb-2">
                <input
                    type="checkbox"
                    className="bg-base-100 ring-base-400 ring-offset-base-100 m-2 h-2 w-2 cursor-pointer appearance-none rounded-sm ring-2 ring-offset-2 checked:bg-lime-500"
                    checked={selected}
                    onChange={handleCheckboxClick}
                />
                <Menu as="div" className="relative">
                    <Menu.Button className="hover:bg-base-400 flex rounded-md px-2 py-1">
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
                        <Menu.Items className="divide-base-200 bg-base-100 absolute right-0 z-10 mt-1 w-48 divide-y rounded-md p-1 shadow-lg focus:outline-none">
                            <div className="flex flex-col p-1">
                                <Menu.Item
                                    disabled={video.status !== VideoStatus.done}
                                >
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-base-300"
                                            }
                                            ${
                                                video.status !==
                                                    VideoStatus.done &&
                                                "pointer-events-none opacity-75"
                                            }
                                            `}
                                            onClick={playVideo}
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlay}
                                                className="text-base-700 w-4 px-2"
                                            />
                                            <Trans>Play</Trans>
                                        </button>
                                    )}
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
                                            <Trans>Open in Finder</Trans>
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="flex flex-col p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-base-300"
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
                        ${video.status === VideoStatus.done && "bg-lime-500"}
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
                <div className="text-base-500 pl-2 text-right text-sm capitalize">
                    {transVideoStatus(video.status!)}
                </div>
            </div>
        </div>
    );
}
