import React from "react";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

export default function LibraryPlaceHolder() {
    window.mainApi.log("debug", "LibraryPlaceHolder rendered!");
    const { setView } = useView();

    return (
        <div className="h-full w-full flex flex-col justify-center text-center text-neutral-400 gap-10">
            <div>No video to watch yet...</div>
            <span>
                Search for a video in the
                <button
                    className="bg-neutral-300 hover:bg-neutral-400 hover:text-neutral-300 rounded p-1 m-1"
                    onClick={() => setView(View.search)}
                >
                    Search
                </button>
                section
            </span>
        </div>
    );
}
