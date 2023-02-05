import React, { Dispatch, SetStateAction } from "react";
import ReactPlayer from "react-player";
import VideoDTO from "../../main/dto/video";
import { abbrNum } from "../utils/helpers";

export default function PreviewModal({
    setShowModal,
    video,
}: {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    video: VideoDTO;
}) {
    window.mainApi.log("debug", "PreviewModal rendered!");
    window.mainApi.log("debug", `video: ${video.videoUri!}`);

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className=" w-3/4 flex-col rounded-lg bg-neutral-200 shadow-2xl ring-2 ring-neutral-500">
                    {/* Header */}
                    <div className="flex w-full items-start justify-between rounded-t border-b border-solid border-slate-300 p-5">
                        <div className="overflow-hidden">
                            <h3 className="truncate font-semibold">
                                {video.title}
                            </h3>
                            <p>{video.author.name}</p>
                            <p>{abbrNum(video.views)} views</p>
                        </div>
                        <button
                            className="p-5 text-2xl text-neutral-400"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                    </div>
                    {/* Video player */}
                    <div className="flex justify-center">
                        <ReactPlayer
                            className="m-4 overflow-hidden rounded-xl"
                            controls
                            volume={0}
                            url={video.videoUri}
                        />
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-300 p-6">
                        <button
                            className="px-6 py-2 text-sm font-semibold uppercase text-neutral-400"
                            type="button"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                        <button
                            className="rounded bg-lime-500 px-6 py-3 text-sm font-semibold uppercase text-neutral-50 shadow duration-200 hover:shadow-lg active:bg-lime-600"
                            type="button"
                            onClick={() => {}}
                        >
                            Remove background music
                        </button>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 backdrop-blur-sm"></div>
        </>
    );
}
