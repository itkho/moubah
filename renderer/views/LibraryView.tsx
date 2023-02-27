import { faCirclePause } from "@fortawesome/free-regular-svg-icons";
import { Trans, t } from "@lingui/macro";

import { faTrash, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import VideoDTO from "../../main/dto/video";
import LibraryPlaceHolder from "../components/LibraryPlaceHolder";
import LibraryVideoItem from "../components/LibraryVideoItem";
import { useLocalVideo } from "../context/LocalVideoContext";
import CustomListbox from "../components/Listbox";
import { VideoStatus } from "../../main/utils/enum";
import { capitalizeFirstLetter } from "../utils/helpers";

enum Sort {
    recentFirst = "recentFirst",
    recentLast = "recentLast",
    alphabetically = "alphabetically",
}

function transSort(sort: Sort) {
    let text: string;
    switch (sort) {
        case Sort.recentFirst:
            text = t`newest`;
            break;
        case Sort.recentLast:
            text = t`oldest`;
            break;
        case Sort.alphabetically:
            text = t`name`;
            break;
    }
    return capitalizeFirstLetter(text);
}

enum Filter {
    all = "all",
    doneOnly = "doneOnly",
    inProgressOnly = "inProgressOnly",
    newOnly = "newOnly",
}

function transFilter(filter: Filter) {
    let text: string;
    switch (filter) {
        case Filter.all:
            text = t`all`;
            break;
        case Filter.doneOnly:
            text = t`done`;
            break;
        case Filter.inProgressOnly:
            text = t`in progress`;
            break;
        case Filter.newOnly:
            text = t`new`;
            break;
    }
    return capitalizeFirstLetter(text);
}

export let updateLocalVideo: (videoUpdated: VideoDTO) => void;

export default function LibraryView({ hidden }: { hidden: boolean }) {
    const {
        localVideos,
        removeLocalVideo,
        setLocalVideos,
        selectedVideos,
        addToSelectedVideos,
        unselectAllVideos,
    } = useLocalVideo();
    const deleteButton = useRef<HTMLButtonElement>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedSort, setSelectedSort] = useState<Sort>(Sort.recentFirst);
    const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);

    const selectedVideoIds = selectedVideos.map((video) => video.id);
    const filteredVideos = localVideos.filter((video) => isNotFiltered(video));

    updateLocalVideo = (videoUpdated) => {
        setLocalVideos(
            localVideos.map((video) =>
                video.id === videoUpdated.id ? videoUpdated : video
            )
        );
    };

    useEffect(() => {
        window.videoApi.getAll().then((videos) => {
            setLocalVideos(videos);
        });
    }, [hidden]);

    useEffect(() => {
        function handleClickOutsideDeleteButton(event: MouseEvent) {
            if (
                deleteButton.current &&
                !deleteButton.current.contains(event.target as Node)
            ) {
                setIsDeleting(false);
            }
        }

        if (isDeleting)
            document.addEventListener("click", handleClickOutsideDeleteButton);

        return () => {
            document.removeEventListener(
                "click",
                handleClickOutsideDeleteButton
            );
        };
    }, [isDeleting]);
    function handlePauseClick() {
        selectedVideos.forEach((video) => pauseProcessVideo(video));
    }

    function pauseProcessVideo(video: VideoDTO) {
        if (video.status === VideoStatus.done) return;
        window.videoApi.pauseProcess(video.id);
    }

    function handleResumeClick() {
        selectedVideos.forEach((video) => resumeProcessVideo(video));
    }

    function resumeProcessVideo(video: VideoDTO) {
        if (!video.metadata.isPending) return;
        window.videoApi.resumeProcess(video.id);
    }

    function handleDeleteClick() {
        if (isDeleting) {
            removeVideos(selectedVideos);
            setIsDeleting(false);
        } else {
            setIsDeleting(true);
        }
    }

    function removeVideos(videos: VideoDTO[]) {
        videos.forEach((video) => {
            removeLocalVideo(video);
            window.videoApi.delete(video.id);
        });
    }

    function toggleSelectAll() {
        if (selectedVideos.length === filteredVideos.length) {
            unselectAllVideos();
        } else {
            addToSelectedVideos(filteredVideos);
        }
    }

    function isNotFiltered(video: VideoDTO): boolean {
        switch (selectedFilter) {
            case Filter.all:
                return true;
            case Filter.doneOnly:
                return video.status === VideoStatus.done;
            case Filter.inProgressOnly:
                return video.status !== VideoStatus.done;
            case Filter.newOnly:
                return video.metadata?.isNew === true;
        }
    }

    function applySort() {
        switch (selectedSort) {
            case Sort.recentFirst:
                localVideos.sort((a, b) =>
                    a.metadata?.creationTimestamp! <
                    b.metadata?.creationTimestamp!
                        ? 1
                        : -1
                );
                break;
            case Sort.recentLast:
                localVideos.sort((a, b) =>
                    a.metadata?.creationTimestamp! >
                    b.metadata?.creationTimestamp!
                        ? 1
                        : -1
                );
                break;
            case Sort.alphabetically:
                localVideos.sort((a, b) => (a.title > b.title ? 1 : -1));
                break;
        }
    }
    // TODO: find a better place to call this function
    // should be call only when localVideos or selectedSort change
    applySort();

    return (
        <>
            {!hidden && (
                <>
                    {localVideos.length ? (
                        <div className="flex h-full w-full flex-col p-10 pr-5 pb-0">
                            <div className="flex justify-between py-2 pr-5">
                                <h1 className="text-4xl">
                                    <Trans>My videos</Trans>
                                </h1>
                                <div className="flex gap-2">
                                    <div className="w-40">
                                        <CustomListbox
                                            prefixText={t`Filter` + " - "}
                                            enumList={Filter}
                                            transEnum={transFilter}
                                            selectedEnum={selectedFilter}
                                            setSelectedEnum={setSelectedFilter}
                                        />
                                    </div>
                                    <div className="w-40">
                                        <CustomListbox
                                            prefixText={t`Sort by` + " - "}
                                            enumList={Sort}
                                            transEnum={transSort}
                                            selectedEnum={selectedSort}
                                            setSelectedEnum={setSelectedSort}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="divide-base-300 flex items-center divide-x-2 py-4">
                                <div className="flex items-center">
                                    {/* Custom check box */}
                                    <div
                                        className="border-base-400 bg-background ml-2 mr-4 h-5 w-5 cursor-pointer rounded-md border-2 p-0.5"
                                        onClick={toggleSelectAll}
                                    >
                                        <div
                                            className={`h-full w-full rounded-sm ${
                                                selectedVideos.length !== 0 &&
                                                selectedVideos.length ===
                                                    filteredVideos.length &&
                                                "bg-lime-500"
                                            }`}
                                        ></div>
                                    </div>
                                    <Trans>Select all</Trans>

                                    <div className="text-base-500 w-32 pl-4">
                                        <Trans>Selected:</Trans>{" "}
                                        {selectedVideos.length}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-2">
                                    <Trans>Actions:</Trans>

                                    <button
                                        className="bg-base-200 hover:bg-base-300 hover:ring-base-400 ring-base-300 cursor-pointer rounded-md py-1 px-2 ring-1 disabled:cursor-not-allowed"
                                        disabled={!selectedVideos.length}
                                        onClick={handlePauseClick}
                                    >
                                        <FontAwesomeIcon
                                            icon={faCirclePause}
                                            className="pr-2"
                                        />
                                        <Trans>Pause</Trans>
                                    </button>
                                    <button
                                        className="bg-base-200 hover:bg-base-300 hover:ring-base-400 ring-base-300 cursor-pointer rounded-md py-1 px-2 ring-1 disabled:cursor-not-allowed"
                                        disabled={!selectedVideos.length}
                                        onClick={handleResumeClick}
                                    >
                                        <FontAwesomeIcon
                                            icon={faVolumeXmark}
                                            className="pr-2"
                                        />
                                        <Trans>Resume</Trans>
                                    </button>
                                    <button
                                        ref={deleteButton}
                                        className={`cursor-pointer rounded-md py-1 px-2 ring-1 disabled:cursor-not-allowed ${
                                            isDeleting
                                                ? "bg-ko-500 text-base-100-light ring-ko-600 hover:bg-ko-600"
                                                : "bg-base-200  hover:bg-base-300 ring-base-300 hover:ring-base-400"
                                        }`}
                                        disabled={!selectedVideos.length}
                                        onClick={handleDeleteClick}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="pr-2"
                                        />
                                        {!isDeleting ? t`Delete` : t`Sure?`}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grow auto-rows-max gap-8 overflow-y-scroll pb-4 pt-8 pr-5 pl-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {filteredVideos.map((video) => (
                                    <LibraryVideoItem
                                        key={video.id}
                                        video={video}
                                        selected={selectedVideoIds.includes(
                                            video.id
                                        )}
                                        removeVideos={removeVideos}
                                        pauseProcessVideo={pauseProcessVideo}
                                        resumeProcessVideo={resumeProcessVideo}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <LibraryPlaceHolder />
                    )}
                </>
            )}
        </>
    );
}
