import React from "react";
import { useView } from "../context/ViewContext";
import ContactView from "./ContactView";
import LibraryView from "./LibraryView";
import PlayerView from "./PlayerView";
import SearchView from "./SearchView";
import { View } from "../utils/enums";

export default function MainView() {
    console.log("MainView rendered!");

    const { view } = useView();

    let seachHidden = true;
    let libraryHidden = true;
    let playerHidden = true;
    let contactHidden = true;

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
        case View.contact:
            contactHidden = false;
            break;
    }

    return (
        <div className="h-full w-full">
            <SearchView hidden={seachHidden} />
            <LibraryView hidden={libraryHidden} />
            <PlayerView hidden={playerHidden} />
            <ContactView hidden={contactHidden} />
        </div>
    );
}
