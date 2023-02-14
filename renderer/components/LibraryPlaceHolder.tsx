import { Trans } from "@lingui/macro";
import React from "react";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

export default function LibraryPlaceHolder() {
    window.mainApi.log("debug", "LibraryPlaceHolder rendered!");
    const { setView } = useView();

    return (
        <div className="text-base-400 flex h-full w-full flex-col justify-center gap-10 text-center">
            <div>
                <Trans>No video to watch yet...</Trans>
            </div>
            <span>
                <Trans>Search for a video in the</Trans>

                <button
                    className="bg-base-200 hover:bg-base-400 hover:text-base-500 m-1 rounded p-1 font-semibold duration-200 hover:bg-opacity-50"
                    onClick={() => setView(View.search)}
                >
                    <Trans>Search</Trans>
                </button>
                <Trans>section</Trans>
            </span>
        </div>
    );
}
