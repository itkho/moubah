import React from "react";
import { ArrowLongUpIcon } from "@heroicons/react/24/solid";

export default function SearchPlaceHolder() {
    window.mainApi.log("debug", "SearchPlaceHolder rendered!");

    return (
        <div className="-z-10 grow flex flex-col justify-center items-center text-neutral-400">
            <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="relative">
                    <ArrowLongUpIcon className="animate-bounce-slow left-1/2 -translate-x-1/2 bottom-20 absolute h-20 stroke-current stroke-[0.01]" />
                    <div>Enter a title or an URL in the search bar</div>
                </div>
            </div>
        </div>
    );
}
