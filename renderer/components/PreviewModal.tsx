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
            <div className="justify-center items-center flex fixed inset-0 z-50">
                <div className=" bg-neutral-100 rounded-lg shadow-lg flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <div>
                            <h3 className="font-semibold">{video.title}</h3>
                            <p>{video.author.name}</p>
                            <p>{abbrNum(video.views)} views</p>
                        </div>
                        <button
                            className="p-1 text-neutral-400 text-2xl"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                    </div>
                    {/* Video player */}
                    <div className="flex justify-center">
                        <ReactPlayer
                            className="m-4 rounded-xl overflow-hidden"
                            controls
                            volume={0}
                            url={video.videoUri}
                        />
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                            className="text-neutral-400 font-semibold uppercase px-6 py-2 text-sm"
                            type="button"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                        <button
                            className="bg-lime-500 text-neutral-50 active:bg-lime-600 font-semibold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all duration-150"
                            type="button"
                            onClick={() => {}}
                        >
                            Remove background music
                        </button>
                    </div>
                </div>
            </div>
            <div className="opacity-50 fixed inset-0 z-40 bg-neutral-900"></div>
        </>
    );
}
