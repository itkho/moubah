import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileLines,
    faCode,
    faWifi,
    faVolumeXmark,
    faComment,
    faPerson,
    faPersonDress,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// TODO: move this in a shared folder (there is others too)
import { MusicRemoverStatus } from "../../main/utils/enum";
import { useOnLine } from "../context/OnlineContext";
import { t, Trans } from "@lingui/macro";
import { Popover } from "@headlessui/react";

const classNameClickable =
    "flex items-center mx-3 gap-2 cursor-pointer hover:text-base-600 focus:outline-none";
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

                <Popover className="relative ">
                    <Popover.Button className={classNameClickable}>
                        <FontAwesomeIcon icon={faComment} />
                        Support
                    </Popover.Button>

                    <Popover.Panel className="absolute bottom-full left-1/2 z-40 -translate-x-1/2">
                        <div className="bg-base-200 ring-base-500 mb-4 flex flex-col rounded-md px-1 ring-[0.5px]">
                            <a
                                className="group my-1 flex items-center gap-2 rounded-md p-2 hover:bg-blue-300 hover:text-neutral-50"
                                href="mailto:moubah.info@gmail.com"
                            >
                                <FontAwesomeIcon
                                    icon={faPerson}
                                    className="h-4 text-blue-300 group-hover:text-neutral-50"
                                />
                                <Trans>Men</Trans>
                            </a>
                            <div className="bg-base-500 h-[0.25px] w-full opacity-50"></div>
                            <a
                                className="group my-1 flex items-center gap-2 rounded-md p-2 hover:bg-pink-300 hover:text-neutral-50"
                                href="mailto:moubah.info@gmail.com"
                            >
                                <FontAwesomeIcon
                                    icon={faPersonDress}
                                    className="h-4 text-pink-300 group-hover:text-neutral-50"
                                />
                                <Trans>Women</Trans>
                            </a>
                        </div>
                    </Popover.Panel>
                </Popover>
                <a
                    className={classNameClickable}
                    href="https://github.com/karim-bouchez/moubah"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub} />
                    Open-source
                </a>
                <div
                    className={classNameClickable}
                    onClick={window.mainApi.openLogsDir}
                >
                    <FontAwesomeIcon icon={faFileLines} />
                    Logs
                </div>
                <div
                    className={classNameClickable}
                    onClick={window.mainApi.toogleDevTools}
                >
                    <FontAwesomeIcon icon={faCode} />
                    Console
                </div>
            </div>
        </>
    );
}
