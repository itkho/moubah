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
import { t, Trans } from "@lingui/macro";

const classNameClickable =
    "flex items-center mx-2 cursor-pointer hover:text-base-600";
const classNameInfo = "flex items-center mx-2 cursor-default";

export let updateMusicRemoverStatus: (status: MusicRemoverStatus) => void;

export default function Footer() {
    console.log("Footer rendered!");

    const [musicRemoverStatus, setMusicRemoverStatus] = useState(
        MusicRemoverStatus.down
    );

    const { onLine } = useOnLine();

    updateMusicRemoverStatus = (status) => {
        setMusicRemoverStatus(status);
    };

    return (
        <>
            <div className="bg-base-200 text-base-500 border-base-500 flex border-t-[0.5px] p-1  text-xs ">
                <div className={classNameInfo}>
                    <FontAwesomeIcon
                        // TODO: use https://www.npmjs.com/package/classnames for this?
                        className={`px-2 ${onLine ? "text-ok" : "text-ko"}`}
                        icon={faWifi}
                    />
                    <div className="capitalize">
                        {onLine ? t`online` : t`offline`}
                    </div>
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
                    <Trans>Music remover</Trans>{" "}
                    {musicRemoverStatus === MusicRemoverStatus.up
                        ? t`online`
                        : t`offline`}
                </div>
                <div className="grow"></div>
                <a
                    className={classNameClickable}
                    href="https://github.com/karim-bouchez/moubah"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub} className="px-2" />
                    Open-source
                </a>
                <div
                    className={classNameClickable}
                    onClick={window.mainApi.openLogsDir}
                >
                    <FontAwesomeIcon icon={faFileLines} className="px-2" />
                    Logs
                </div>
                <div
                    className={classNameClickable}
                    onClick={window.mainApi.toogleDevTools}
                >
                    <FontAwesomeIcon icon={faCode} className="px-2" />
                    Console
                </div>
            </div>
        </>
    );
}
