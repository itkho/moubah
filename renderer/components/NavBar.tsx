import React from "react";
import {
    MagnifyingGlassIcon,
    ListBulletIcon,
    PlayCircleIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";

import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const classNameListItem =
    "flex items-center gap-2 cursor-pointer my-4 p-2 rounded hover:bg-neutral-700 hover:text-neutral-200 duration-200";

export default function NavBar() {
    console.log("NavBar rendered!");
    const { view, setView } = useView();

    return (
        <div className="basis-56 h-full bg-neutral-800 text-neutral-400">
            <ul className="p-4">
                <li
                    onClick={() => setView(View.search)}
                    className={
                        classNameListItem +
                        (view === View.search
                            ? " bg-neutral-700 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className={`px-1 ${
                            view === View.search ? "text-lime-500" : ""
                        }`}
                    />
                    Search
                </li>
                <li
                    onClick={() => setView(View.library)}
                    className={
                        classNameListItem +
                        (view === View.library
                            ? " bg-neutral-700 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <FontAwesomeIcon
                        icon={faList}
                        className={`px-1 ${
                            view === View.library ? "text-lime-500" : ""
                        }`}
                    />
                    Library
                </li>
                <li
                    onClick={() => setView(View.player)}
                    className={
                        classNameListItem +
                        (view === View.player
                            ? " bg-neutral-700 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <FontAwesomeIcon
                        icon={faCirclePlay}
                        className={`px-1 ${
                            view === View.player ? "text-lime-500" : ""
                        }`}
                    />
                    Player
                </li>
                <li
                    onClick={() => setView(View.contact)}
                    className={
                        classNameListItem +
                        (view === View.contact
                            ? " bg-neutral-700 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <FontAwesomeIcon
                        icon={faMessage}
                        className={`px-1 ${
                            view === View.contact ? "text-lime-500" : ""
                        }`}
                    />
                    Contact us
                </li>
            </ul>
        </div>
    );
}
