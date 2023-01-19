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

const classNameClickable =
    "flex items-center mx-2 cursor-pointer hover:text-neutral-200";
const classNameInfo = "flex items-center mx-2 cursor-default";

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
            <div className="flex bg-neutral-800 text-neutral-400 p-1 text-xs">
                <div className={classNameInfo}>
                    <FontAwesomeIcon
                        // TODO: use https://www.npmjs.com/package/classnames for this?
                        className={`px-2 ${onLine ? "text-ok" : "text-ko"}`}
                        icon={faWifi}
                    />
                    {onLine ? "Online" : "Offline"}
                </div>
                <div className={classNameInfo}>
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
                    className={classNameClickable}
                    href="https://github.com/karim-bouchez/moubah"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub} className=" px-2" />
                    Open-source
                </a>
                <div
                    className={classNameClickable}
                    onClick={window.mainApi.openLogsDir}
                >
                    <FontAwesomeIcon icon={faFileLines} className=" px-2" />
                    Log
                </div>
                <div
                    className={classNameClickable}
                    onClick={window.mainApi.toogleDevTools}
                >
                    <FontAwesomeIcon icon={faCode} className=" px-2" />
                    Console
                </div>
            </div>
        </>
    );
}
