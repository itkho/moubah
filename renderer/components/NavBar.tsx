import React from "react";
import {
    MagnifyingGlassIcon,
    ListBulletIcon,
    PlayCircleIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";

const classNameListItem =
    "flex items-center gap-2 cursor-pointer my-4 p-2 rounded hover:bg-neutral-600 hover:text-neutral-200";
const classNameIcon = "fill-none h-5 stroke-current stroke-2";

export default function NavBar() {
    console.log("NavBar mounted!");
    const { view, setView } = useView();

    return (
        <div className="basis-56 h-full bg-neutral-700 text-neutral-400">
            <ul className="p-4">
                <li
                    onClick={() => setView(View.search)}
                    className={
                        classNameListItem +
                        (view === View.search
                            ? " bg-neutral-500 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <MagnifyingGlassIcon className={classNameIcon} />
                    Search
                </li>
                <li
                    onClick={() => setView(View.library)}
                    className={
                        classNameListItem +
                        (view === View.library
                            ? " bg-neutral-500 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <ListBulletIcon className={classNameIcon} />
                    Library
                </li>
                <li
                    onClick={() => setView(View.player)}
                    className={
                        classNameListItem +
                        (view === View.player
                            ? " bg-neutral-500 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <PlayCircleIcon className={classNameIcon} />
                    Player
                </li>
                <li
                    onClick={() => setView(View.contact)}
                    className={
                        classNameListItem +
                        (view === View.contact
                            ? " bg-neutral-500 text-neutral-200 pointer-events-none"
                            : "")
                    }
                >
                    <ChatBubbleBottomCenterTextIcon className={classNameIcon} />
                    Contact us
                </li>
            </ul>
        </div>
    );
}
