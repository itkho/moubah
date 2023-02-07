import { faCirclePause } from "@fortawesome/free-regular-svg-icons";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import VideoDTO from "../../main/dto/video";
import LibraryPlaceHolder from "../components/LibraryPlaceHolder";
import LibraryVideoItem from "../components/LibraryVideoItem";
import { useLocalVideo } from "../context/LocalVideoContext";
import CustomListbox from "../components/Listbox";
import { VideoStatus } from "../../main/utils/enum";

export enum Sort {
    recentFirst = "Recent first",
    recentLast = "Recent last",
    alphabetically = "Alphabetically",
}

export enum Filter {
    all = "All",
    doneOnly = "Done only",
    inProgressOnly = "In progress only",
    notSeenOnly = "(TODO) Not seen only",
}

export let updateLocalVideo: (videoUpdated: VideoDTO) => void;

export default function LibraryView({ hidden }: { hidden: boolean }) {
    window.mainApi.log("debug", "LibraryView rendered!");
    console.log("LibraryView rendered!");

    const {
        localVideos,
        removeLocalVideo,
        setLocalVideos,
        selectedVideos,
        toggleSelectAllVideos,
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

    function removeVideos(videos: VideoDTO[]) {
        videos.forEach((video) => {
            removeLocalVideo(video);
            window.videoApi.delete(video.id);
        });
    }

    function handleDeleteClick() {
        if (isDeleting) {
            removeVideos(selectedVideos);
            setIsDeleting(false);
        } else {
            setIsDeleting(true);
        }
    }

    function isNotFiltered(video: VideoDTO) {
        switch (selectedFilter) {
            case Filter.all:
                return true;
            case Filter.doneOnly:
                return video.status === VideoStatus.done;
            case Filter.inProgressOnly:
                return video.status !== VideoStatus.done;
        }
    }

    function applySort() {
        switch (selectedSort) {
            case Sort.recentFirst:
                localVideos.sort((a, b) =>
                    a.metadata!.creationTimestamp <
                    b.metadata!.creationTimestamp
                        ? 1
                        : -1
                );
                break;
            case Sort.recentLast:
                localVideos.sort((a, b) =>
                    a.metadata!.creationTimestamp >
                    b.metadata!.creationTimestamp
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
                                <h1 className="text-4xl">My videos</h1>
                                <div className="flex gap-2">
                                    <div className="w-48">
                                        <CustomListbox
                                            prefixText={"Filter - "}
                                            enumList={Filter}
                                            selectedEnum={selectedFilter}
                                            setSelectedEnum={setSelectedFilter}
                                        />
                                    </div>
                                    <div className="w-52">
                                        <CustomListbox
                                            prefixText={"Sorted by - "}
                                            enumList={Sort}
                                            selectedEnum={selectedSort}
                                            setSelectedEnum={setSelectedSort}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center divide-x-2 divide-neutral-300 py-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="ml-2 mr-4 h-3 w-3 cursor-pointer appearance-none rounded-sm bg-neutral-200 ring-2 ring-neutral-400 ring-offset-2 ring-offset-neutral-200 checked:bg-lime-500"
                                        checked={
                                            localVideos.length ===
                                            selectedVideos.length
                                        }
                                        onChange={toggleSelectAllVideos}
                                    />
                                    Select all
                                    <div className="w-28 pl-4 text-neutral-500">
                                        Selected: {selectedVideos.length}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-2">
                                    Actions:
                                    <button
                                        className="cursor-pointer rounded-md bg-neutral-300 py-1 px-2 disabled:cursor-not-allowed hover:bg-neutral-400"
                                        // TODO: finish implement this  (it should pause the downloading/procesing)
                                        disabled={true}
                                        onClick={() => {}}
                                    >
                                        <FontAwesomeIcon
                                            icon={faCirclePause}
                                            className="pr-2"
                                        />
                                        Pause
                                    </button>
                                    <button
                                        ref={deleteButton}
                                        className={`cursor-pointer rounded-md bg-neutral-300 py-1 px-2 disabled:cursor-not-allowed hover:bg-neutral-400 ${
                                            isDeleting && "text-ko"
                                        }`}
                                        disabled={!selectedVideos.length}
                                        onClick={handleDeleteClick}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="pr-2"
                                        />
                                        {!isDeleting ? "Delete" : "Sure?"}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grow auto-rows-max gap-4 overflow-scroll pb-4 pt-2 pr-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {filteredVideos.map((video) => (
                                    <LibraryVideoItem
                                        key={video.id}
                                        video={video}
                                        selected={selectedVideoIds.includes(
                                            video.id
                                        )}
                                        removeVideos={removeVideos}
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
