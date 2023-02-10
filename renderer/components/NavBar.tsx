import React from "react";
import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { useDarkMode } from "../context/DarkModeContext";

import iconDark from "../assets/icons/favicon-dark.svg";

const classNameListItem =
    "flex items-center gap-2 cursor-pointer my-2 p-2 rounded-lg hover:bg-base-300 hover:bg-opacity-50 hover:text-base-700 duration-200";

export default function NavBar() {
    console.log("NavBar rendered!");

    const { view, setView } = useView();
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <div className="bg-base-200 text-base-700 border-base-500 h-full shrink-0 basis-48 border-r-[0.5px]  dark:drop-shadow-none">
            <div className="flex h-full flex-col justify-between">
                <ul className="p-4">
                    <li
                        onClick={() => setView(View.search)}
                        className={
                            classNameListItem +
                            (view === View.search &&
                                "text-base-800 bg-base-300 pointer-events-none font-semibold")
                        }
                    >
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className={`pl-1 pr-3 ${
                                view === View.search && "text-highlight"
                            }`}
                        />
                        Search
                    </li>
                    <li
                        onClick={() => setView(View.library)}
                        className={
                            classNameListItem +
                            (view === View.library &&
                                "text-base-700 bg-base-300 pointer-events-none font-semibold")
                        }
                    >
                        <FontAwesomeIcon
                            icon={faList}
                            className={`pl-1 pr-3 ${
                                view === View.library && "text-highlight"
                            }`}
                        />
                        Library
                    </li>
                    <li
                        onClick={() => setView(View.player)}
                        className={
                            classNameListItem +
                            (view === View.player &&
                                "text-base-700 bg-base-300 pointer-events-none font-semibold")
                        }
                    >
                        <FontAwesomeIcon
                            icon={faCirclePlay}
                            className={`pl-1 pr-3 ${
                                view === View.player && "text-highlight"
                            }`}
                        />
                        Player
                    </li>
                    <li
                        onClick={() => setView(View.contact)}
                        className={
                            classNameListItem +
                            (view === View.contact &&
                                "text-base-700 bg-base-300 pointer-events-none font-semibold")
                        }
                    >
                        <FontAwesomeIcon
                            icon={faMessage}
                            className={`pl-1 pr-3 ${
                                view === View.contact && "text-highlight"
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
                        className="bg-base-600 relative mx-2 inline-flex h-6 w-11 items-center rounded-full"
                    >
                        <svg
                            height="100"
                            viewBox="0 0 100 100"
                            width="100"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`${
                                darkMode
                                    ? "translate-x-1"
                                    : "bg-base-200 translate-x-6"
                            } fill-base-200 inline-block h-4 w-4 transform rounded-full  transition`}
                        >
                            <path d="m65.6283 2.49084c-9.8215 13.28556-15.6283 29.71926-15.6283 47.50916s5.8068 34.2236 15.6283 47.5092c-4.9169 1.6165-10.1705 2.4908-15.6283 2.4908-27.6142 0-50-22.3859-50-50s22.3858-50 50-50c5.4578 0 10.7114.874329 15.6283 2.49084z" />
                        </svg>
                    </Switch>
                    <div className="text-xs font-semibold uppercase">Light</div>
                </div>
            </div>
        </div>
    );
}
