import React from "react";
import { useView } from "../context/ViewContext";
import LibraryView from "./LibraryView";
import PlayerView from "./PlayerView";
import SearchView from "./SearchView";
import { Locale, View } from "../utils/enums";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../context/DarkModeContext";
import { useLocale } from "../context/LocaleContext";

const CustomToastWithLink = (text: string, link: string) => (
    <a href={link} target="_blank" className="">
        {text}
    </a>
);
export function showToastMessage(
    timestamp: number,
    type: TypeOptions,
    text: string,
    link: string
) {
    toast(CustomToastWithLink(text, link), {
        onClose: () => window.mainApi.lastMessageSeenTimestamp(timestamp),
        type: type,
    });
}

export default function MainView() {
    const { darkMode } = useDarkMode();
    const { locale } = useLocale();
    const { view } = useView();

    let seachHidden = true;
    let libraryHidden = true;
    let playerHidden = true;

    switch (view) {
        case View.search:
            seachHidden = false;
            break;
        case View.library:
            libraryHidden = false;
            break;
        case View.player:
            playerHidden = false;
            break;
    }

    return (
        <div className="z-40 h-full w-full">
            <SearchView hidden={seachHidden} />
            <LibraryView hidden={libraryHidden} />
            <PlayerView hidden={playerHidden} autoplay={true} />
            <ToastContainer
                position="bottom-right"
                autoClose={false}
                newestOnTop={false}
                rtl={locale === Locale.ar ? true : false}
                theme={darkMode ? "dark" : "light"}
                draggable
            />
        </div>
    );
}
