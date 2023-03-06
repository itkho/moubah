import { Trans } from "@lingui/macro";
import React, { Dispatch, SetStateAction } from "react";
import ReactPlayer from "react-player";
import VideoDTO from "../../main/dto/video";
import { abbrNum } from "../utils/helpers";

export default function PreviewModal({
    setShowModal,
    video,
    primaryButtonText,
    onClickPrimary,
}: {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    video: VideoDTO;
    primaryButtonText: string;
    onClickPrimary: () => void;
}) {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className=" bg-background ring-base-500 w-3/4 flex-col rounded-lg shadow-2xl ring-2">
                    {/* Header */}
                    <div className="border-base-300 flex w-full items-start justify-between rounded-t border-b border-solid p-5">
                        <div className="overflow-hidden">
                            <h3 className="truncate text-xl font-semibold">
                                {video.title}
                            </h3>
                            <p className="text-lg font-light">
                                {video.author.name}
                            </p>
                            <p className="font-light">
                                {abbrNum(video.views)} views
                            </p>
                        </div>
                        <button
                            className="text-base-400 p-5 text-2xl"
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
                    <div className="border-base-300 flex items-center justify-end rounded-b border-t border-solid p-6">
                        <button
                            className="text-base-500 hover:text-base-600 px-6 py-2 text-sm font-semibold uppercase"
                            type="button"
                            onClick={() => setShowModal(false)}
                        >
                            <Trans>Close</Trans>
                        </button>
                        <button
                            className="text-base-50 bg-highlight hover:bg-highlight-hover rounded px-6 py-3 text-sm font-semibold uppercase text-base-100-light shadow duration-200 hover:shadow-lg"
                            type="button"
                            onClick={onClickPrimary}
                        >
                            {primaryButtonText}
                            {/* <Trans>Remove background music</Trans> */}
                        </button>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 backdrop-blur-sm"></div>
        </>
    );
}
