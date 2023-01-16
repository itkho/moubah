import React from "react";
import {
    MagnifyingGlassIcon,
    ListBulletIcon,
    PlayCircleIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { useView } from "./context/ViewContext";
import { View } from "./enums";

export default function NavBar() {
    console.log("NavBar mounted!");
    const { setView } = useView();

    return (
        <div className="basis-56 h-full bg-gray-2 text-gray-1">
            <ul className="p-8">
                <li
                    onClick={() => setView(View.search)}
                    className="flex items-center gap-2 cursor-pointer my-4"
                >
                    <MagnifyingGlassIcon className="fill-none h-5 stroke-current stroke-2" />
                    Search
                </li>
                <li
                    onClick={() => setView(View.library)}
                    className="flex items-center gap-2 cursor-pointer my-4"
                >
                    <ListBulletIcon className="fill-none h-5 stroke-current stroke-2" />
                    Library
                </li>
                <li
                    onClick={() => setView(View.player)}
                    className="flex items-center gap-2 cursor-pointer my-4"
                >
                    <PlayCircleIcon className="fill-none h-5 stroke-current stroke-2" />
                    Player
                </li>
                <li
                    onClick={() => setView(View.contact)}
                    className="flex items-center gap-2 cursor-pointer my-4"
                >
                    <ChatBubbleBottomCenterTextIcon className="fill-none h-5 stroke-current stroke-2" />
                    Contact us
                </li>
            </ul>
        </div>
    );
}
