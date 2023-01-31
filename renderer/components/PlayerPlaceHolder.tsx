import React from "react";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

export default function PlayerPlaceHolder() {
    window.mainApi.log("debug", "PlayerPlaceHolder rendered!");
    const { setView } = useView();

    return (
        <div className="flex h-full w-full flex-col justify-center text-center text-neutral-400">
            <span>
                Select a video in the
                <button
                    className="m-1 rounded bg-neutral-300 p-1 duration-200 hover:bg-neutral-400 hover:text-neutral-300"
                    onClick={() => setView(View.library)}
                >
                    Library
                </button>
            </span>
        </div>
    );
}
