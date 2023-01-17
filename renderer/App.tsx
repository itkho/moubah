import React from "react";
import Footer from "./components/Footer";
import MainView from "./views/MainView";
import NavBar from "./components/NavBar";

import { ViewProvider } from "./context/ViewContext";
import { LocalVideoProvider } from "./context/LocalVideoContext";
import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
    console.log("App mounted!");

    return (
        <>
            <div className="w-screen h-screen flex flex-col bg-background text-gray-3">
                <ViewProvider>
                    <div className="flex flex-grow">
                        <NavBar />
                        <LocalVideoProvider>
                            <PlayerProvider>
                                <MainView />
                            </PlayerProvider>
                        </LocalVideoProvider>
                    </div>
                    <Footer />
                </ViewProvider>
            </div>
        </>
    );
}
