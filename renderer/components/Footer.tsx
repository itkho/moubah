import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileLines,
    faCode,
    faWifi,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// TODO: move this in a shared folder (there is others too)
import { MusicRemoverStatus } from "../../main/utils/enum";
import { useOnLine } from "../context/OnlineContext";

export let updateMusicRemoverStatus: (status: MusicRemoverStatus) => void;

export default function Footer() {
    const [musicRemoverStatus, setMusicRemoverStatus] = useState(
        MusicRemoverStatus.down
    );

    const { onLine } = useOnLine();

    updateMusicRemoverStatus = (status) => {
        setMusicRemoverStatus(status);
    };

    return (
        <>
            <div className="flex bg-gray-3 text-gray-1 p-1 text-xs">
                <div className="flex items-center mx-2 cursor-default">
                    <FontAwesomeIcon
                        className={`px-2 ${onLine ? "text-ok" : "text-ko"}`}
                        icon={faWifi}
                    />
                    {onLine ? "Online" : "Offline"}
                </div>
                <div className="flex items-center mx-2 cursor-default">
                    <FontAwesomeIcon
                        className={`px-2 ${
                            musicRemoverStatus === MusicRemoverStatus.up
                                ? "text-ok"
                                : "text-ko"
                        }`}
                        icon={faVolumeXmark}
                    />
                    Music remover{" "}
                    {musicRemoverStatus === MusicRemoverStatus.up
                        ? "online"
                        : "offline"}
                </div>
                <div className="grow"></div>
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
