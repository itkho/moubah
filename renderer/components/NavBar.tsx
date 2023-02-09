import React from "react";
import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { useDarkMode } from "../context/DarkModeContext";

const classNameListItem =
    "flex items-center gap-2 cursor-pointer my-4 p-2 rounded hover:bg-base-300 hover:bg-opacity-50 hover:text-base-700 duration-200";

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
                            className={`px-1 ${
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
                            className={`px-1 ${
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
                            className={`px-1 ${
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
                            className={`px-1 ${
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
                        <span
                            className={`${
                                darkMode ? "translate-x-1" : "translate-x-6"
                            } bg-base-200 inline-block h-4 w-4 transform rounded-full transition`}
                        />
                    </Switch>
                    <div className="text-xs font-semibold uppercase">Light</div>
                </div>
            </div>
        </div>
    );
}
