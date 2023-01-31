import React from "react";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

export default function LibraryPlaceHolder() {
    window.mainApi.log("debug", "LibraryPlaceHolder rendered!");
    const { setView } = useView();

    return (
        <div className="flex h-full w-full flex-col justify-center gap-10 text-center text-neutral-400">
            <div>No video to watch yet...</div>
            <span>
                Search for a video in the
                <button
                    className="m-1 rounded bg-neutral-300 p-1 duration-200 hover:bg-neutral-400 hover:text-neutral-300"
                    onClick={() => setView(View.search)}
                >
                    Search
                </button>
                section
            </span>
        </div>
    );
}
