import React from "react";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

export default function PlayerPlaceHolder() {
    window.mainApi.log("debug", "PlayerPlaceHolder rendered!");
    const { setView } = useView();

    return (
        <div className="h-full w-full flex flex-col justify-center text-center text-neutral-400">
            <span>
                Select a video in the
                <button
                    className="bg-neutral-300 hover:bg-neutral-400 hover:text-neutral-300 rounded p-1 m-1 duration-200"
                    onClick={() => setView(View.library)}
                >
                    Library
                </button>
            </span>
        </div>
    );
}
