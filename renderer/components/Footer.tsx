import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faCode } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// TODO: move this in a shared folder (there is others too)
import { MusicRemoverStatus } from "../../main/utils/enum";

export let updateMusicRemoverStatus: (status: MusicRemoverStatus) => void;

export default function Footer() {
    const [musicRemoverStatus, setMusicRemoverStatus] = useState(
        MusicRemoverStatus.down
    );

    updateMusicRemoverStatus = (status) => {
        setMusicRemoverStatus(status);
    };

    return (
        <>
            <div className="flex bg-gray-3 text-gray-1 px-4">
                <div className="flex items-center grow cursor-default">
                    Music remover status:
                    <div
                        className={`rounded-full h-4 w-4 mx-2 ${
                            musicRemoverStatus === MusicRemoverStatus.up
                                ? "bg-green-700"
                                : "bg-red-700"
                        }`}
                    ></div>
                </div>
                <a
                    className="flex items-center mx-2 cursor-pointer"
                    href="https://github.com/karim-bouchez/moubah"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub} className=" px-2" />
                    Open-source
                </a>
                <div
                    className="flex items-center mx-2 cursor-pointer"
                    onClick={window.mainApi.openLogsDir}
                >
                    <FontAwesomeIcon icon={faFileLines} className=" px-2" />
                    Log
                </div>
                <div
                    className="flex items-center mx-2 cursor-pointer"
                    onClick={window.mainApi.toogleDevTools}
                >
                    <FontAwesomeIcon icon={faCode} className=" px-2" />
                    Console
                </div>
            </div>
        </>
    );
}
