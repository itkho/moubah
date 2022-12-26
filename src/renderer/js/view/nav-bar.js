import { View } from "../enum.js";
import { displayLibrary } from "./library.js";

const views = document.getElementsByClassName("view");

function onViewDisplayed(view) {
    const viewName = view.id.replace("-view", "")
    switch (viewName) {
        case View.search:
            break;
        case View.library:
            displayLibrary();
            break;
        case View.player:
            break;
    }
}

export function switchView() {
    Array.from(views).forEach((view) => {
        if (this.id.replace("-nav-link", "") == view.id.replace("-view", "")) {
            view.style.display = "flex";
            onViewDisplayed(view);
        } else {
            view.style.display = "none";
        }
    });
};
