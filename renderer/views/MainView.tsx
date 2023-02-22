import React from "react";
import { useView } from "../context/ViewContext";
import LibraryView from "./LibraryView";
import PlayerView from "./PlayerView";
import SearchView from "./SearchView";
import { View } from "../utils/enums";

export default function MainView() {
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
            <PlayerView hidden={playerHidden} />
        </div>
    );
}
