import React from "react";
import Footer from "./components/Footer";
import MainView from "./views/MainView";
import NavBar from "./components/NavBar";

import { ViewProvider } from "./context/ViewContext";
import { LocalVideoProvider } from "./context/LocalVideoContext";
import { PlayerProvider } from "./context/PlayerContext";
import { OnLineProvider } from "./context/OnlineContext";

export default function App() {
    console.log("App mounted!");

    return (
        <>
            <div className="w-screen h-screen flex flex-col bg-neutral-200 text-neutral-800">
                <OnLineProvider>
                    <ViewProvider>
                        <div className="flex grow">
                            <NavBar />
                            <LocalVideoProvider>
                                <PlayerProvider>
                                    <MainView />
                                </PlayerProvider>
                            </LocalVideoProvider>
                        </div>
                    </ViewProvider>
                    <Footer />
                </OnLineProvider>
            </div>
        </>
    );
}
