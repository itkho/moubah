import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
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
            addToSelectedVideos(video);
        }
    }

    return (
        <div className="max-w-30 flex-col rounded-md bg-neutral-300 p-2 hover:shadow-xl">
            <div className="flex items-center justify-between">
                <input
                    type="checkbox"
                    className="m-2 h-3 w-3 cursor-pointer appearance-none rounded-sm bg-neutral-200 ring-2 ring-neutral-400 ring-offset-2 ring-offset-neutral-200 checked:bg-lime-500"
                    checked={selected}
                    onChange={handleCheckboxClick}
                />
                <Menu as="div" className="relative z-10">
                    <Menu.Button className="rounded-md px-2 py-1 hover:bg-neutral-400">
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
                        <Menu.Items className="absolute right-0 mt-1 w-48 divide-y divide-neutral-200 rounded-md bg-neutral-100 p-1 shadow-lg focus:outline-none">
                            <div className="flex flex-col p-1">
                                <Menu.Item
                                    disabled={video.status !== VideoStatus.done}
                                >
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-neutral-300"
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
                                                className="w-4 px-2 text-neutral-700"
                                            />
                                            Play
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-neutral-300"
                                            }`}
                                        >
                                            <FontAwesomeIcon
                                                icon={faFolderOpen}
                                                className="w-4 px-2 text-neutral-700"
                                            />
                                            Open in Finder
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="flex flex-col p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`rounded-md p-1 text-left ${
                                                active && "bg-neutral-300"
                                            }`}
                                            onClick={() =>
                                                removeVideos([video])
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="w-4 px-2 text-neutral-700"
                                            />
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className="truncate text-lg">{video.title}</div>
            <div className="text-sm">By: {video.author!.name}</div>
            <div
                className={`group relative my-2 overflow-hidden rounded-2xl ${
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
                    className="absolute top-1/2 left-1/2 h-10 -translate-x-1/2 -translate-y-1/2 text-neutral-200 duration-200 ease-in group-hover:scale-125 group-hover:text-neutral-50 "
                />
                <div className="absolute bottom-0 right-0 rounded-tl border-t-2 border-l-2 border-neutral-300 bg-neutral-200 p-1 text-neutral-500">
                    <div className="flex divide-x-2 divide-neutral-300 text-sm">
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
                <div className="h-2 grow rounded-full bg-neutral-100">
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
                <div className="w-24 px-2 text-right text-sm capitalize text-neutral-500">
                    {video.status}
                </div>
            </div>
        </div>
    );
}
