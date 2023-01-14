import React from "react";
import { useView } from "./ViewContext";
import ContactView from "./ContactView";
import LibraryView from "./LibraryView";
import PlayerView from "./PlayerView";
import SearchView from "./SearchView";

export default function MainView() {
    console.log("MainView mounted!");

    const view = useView();

    let seachHidden = true;
    let libraryHidden = true;
    let playerHidden = true;
    let contactHidden = true;

    switch (view) {
        case "search":
            seachHidden = false;
            break;
        case "library":
            libraryHidden = false;
            break;
        case "player":
            playerHidden = false;
            break;
        case "contact":
            contactHidden = false;
            break;
    }

    return (
        <>
            <SearchView hidden={seachHidden} />
            <LibraryView hidden={libraryHidden} />
            <PlayerView hidden={playerHidden} />
            <ContactView hidden={contactHidden} />
        </>
    );
}
