import React, { useState } from "react";
import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { useDarkMode } from "../context/DarkModeContext";

const classNameListItem =
    "flex items-center gap-2 cursor-pointer my-4 p-2 rounded hover:bg-neutral-700 hover:text-neutral-200 duration-200";

export default function NavBar() {
    console.log("NavBar rendered!");

    const { view, setView } = useView();
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <div className="h-full shrink-0 basis-48 bg-neutral-800 text-neutral-400 drop-shadow-[0_0px_5px_rgba(0,0,0,0.25)]">
            <div className="flex h-full flex-col justify-between">
                <ul className="p-4">
                    <li
                        onClick={() => setView(View.search)}
                        className={
                            classNameListItem +
                            (view === View.search
                                ? " pointer-events-none bg-neutral-700 text-neutral-200"
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
                                ? " pointer-events-none bg-neutral-700 text-neutral-200"
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
                                ? " pointer-events-none bg-neutral-700 text-neutral-200"
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
                                ? " pointer-events-none bg-neutral-700 text-neutral-200"
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
                <div className="flex items-center justify-center py-8">
                    <div className="text-xs font-semibold uppercase">Dark</div>
                    <Switch
                        checked={darkMode}
                        onChange={setDarkMode}
                        className={`${
                            darkMode ? "bg-neutral-300" : "bg-neutral-600"
                        } relative mx-2 inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span
                            className={`${
                                darkMode
                                    ? "translate-x-1 bg-neutral-600"
                                    : "translate-x-6 bg-neutral-300"
                            } inline-block h-4 w-4 transform rounded-full transition`}
                        />
                    </Switch>
                    <div className="text-xs font-semibold uppercase">Light</div>
                </div>
            </div>
        </div>
    );
}
