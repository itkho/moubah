import React from "react";
import { ArrowLongUpIcon } from "@heroicons/react/24/solid";
import { Trans } from "@lingui/macro";

export default function SearchPlaceHolder() {
    window.mainApi.log("debug", "SearchPlaceHolder rendered!");

    return (
        <div className="text-base-400 -z-10 flex grow flex-col items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative">
                    <ArrowLongUpIcon className="absolute left-1/2 bottom-20 h-20 -translate-x-1/2 animate-bounce-slow stroke-current stroke-[0.01]" />
                    <div>
                        <Trans>
                            Enter the title of a video or an URL in the search
                            bar
                        </Trans>
                    </div>
                </div>
            </div>
        </div>
    );
}
