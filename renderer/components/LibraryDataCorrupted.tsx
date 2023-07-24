import { Trans } from "@lingui/macro";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React, { Dispatch, SetStateAction } from "react";

export default function LibraryDataCorrupted({
    setIsDataCorrupted,
}: {
    setIsDataCorrupted: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <div className="text-base-400 m flex h-full w-full flex-col  items-center justify-center gap-2 text-center">
            <ExclamationTriangleIcon className="h-32 w-32 text-[#C77F7F]" />
            <div className="text-[#C77F7F]">
                <Trans>Something is wrong with the local videos...</Trans>
            </div>
            <span className="mt-10">
                <Trans>You can</Trans>

                <button
                    className="bg-base-200 hover:text-base-100 m-1 rounded p-1 font-semibold duration-200 hover:bg-[#C77F7F]"
                    onClick={() => {
                        setIsDataCorrupted(false);
                        window.videoApi.deleteAll();
                    }}
                >
                    <Trans>Remove all videos</Trans>
                </button>
                <Trans>in order to fix this</Trans>
            </span>
            <span>
                <Trans>(don't forget to</Trans>
                <span> </span>
                <button
                    className="hover:text-base-500 decoration-highlight hover:underline"
                    onClick={() => window.videoApi.openDir}
                >
                    <Trans>set aside the videos</Trans>
                </button>
                <span> </span>
                <Trans>you want to keep)</Trans>
            </span>
        </div>
    );
}
