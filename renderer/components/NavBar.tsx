import React, { Fragment } from "react";
import {
    faList,
    faMagnifyingGlass,
    faEarthAmerica,
} from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useView } from "../context/ViewContext";
import { View } from "../utils/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Switch, Transition } from "@headlessui/react";
import { Locale } from "../utils/enums";
import { US, FR, SA } from "country-flag-icons/react/3x2";
const Flags = { en: US, fr: FR, ar: SA };

import { useDarkMode } from "../context/DarkModeContext";
import { useLocale } from "../context/LocaleContext";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { langFromLocale } from "../utils/helpers";
import { Trans } from "@lingui/macro";

const classNameListItem =
    "flex items-center gap-2 cursor-pointer my-2 p-2 rounded-lg hover:bg-base-300 hover:bg-opacity-50 hover:text-base-700 duration-200";

export default function NavBar() {
    console.log("NavBar rendered!");

    const { view, setView } = useView();
    const { darkMode, changeDarkMode } = useDarkMode();
    const { locale, setLocale } = useLocale();

    return (
        <div className="bg-base-200 text-base-700 border-base-500 h-full shrink-0 basis-48 border-r-[0.5px]  dark:drop-shadow-none">
            <div className="flex h-full flex-col justify-between">
                {/* Items */}
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
                        <Trans>Search</Trans>
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
                        <Trans>Library</Trans>
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
                        <Trans>Player</Trans>
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
                        <Trans>Contact us</Trans>
                    </li>
                </ul>
                {/* Widgets */}
                <div className="flex flex-col">
                    <div className="mx-4">
                        <Listbox value={locale} onChange={setLocale}>
                            <div className="relative">
                                <Listbox.Button className="text-base-600 relative flex w-full items-center justify-between text-left text-sm">
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faEarthAmerica}
                                            className="pl-6 pr-2"
                                        />
                                        {langFromLocale(locale)}
                                    </div>
                                    <ChevronUpDownIcon
                                        className="mr-6 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </Listbox.Button>
                                <Transition
                                    as="div"
                                    // as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute bottom-full z-10 mb-4 w-full rounded-md bg-base-100-light py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-base-500-light">
                                        <div className="relative">
                                            <Listbox.Options>
                                                {Object.values(Locale).map(
                                                    (value) => {
                                                        const Flag =
                                                            Flags[value];
                                                        return (
                                                            <Listbox.Option
                                                                key={value}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-lime-100 text-lime-900"
                                                                            : "text-base-800-light dark:text-base-200-light"
                                                                    }`
                                                                }
                                                                value={value}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`flex items-center truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            <Flag className="mr-2 h-4 shrink-0 rounded" />
                                                                            {langFromLocale(
                                                                                value
                                                                            )}
                                                                        </span>
                                                                        {selected && (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lime-600">
                                                                                <CheckIcon
                                                                                    className="h-5 w-5"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        );
                                                    }
                                                )}
                                            </Listbox.Options>
                                            <div className="clip-path-triangle absolute -bottom-[10px] left-1/2 h-3 w-3 -translate-x-1/2 -rotate-45 bg-base-100-light shadow-lg ring-1 ring-black dark:bg-base-500-light"></div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-xs font-semibold uppercase">
                            <Trans>Dark</Trans>
                        </div>
                        <Switch
                            checked={darkMode}
                            onChange={changeDarkMode}
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
                        <div className="text-xs font-semibold uppercase">
                            <Trans>Light</Trans>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
