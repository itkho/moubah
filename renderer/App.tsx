import React from "react";
import Footer from "./components/Footer";
import MainView from "./views/MainView";
import NavBar from "./components/NavBar";

import { ViewProvider } from "./context/ViewContext";
import { LocalVideoProvider } from "./context/LocalVideoContext";
import { PlayerProvider } from "./context/PlayerContext";
import { OnLineProvider } from "./context/OnlineContext";
import { useDarkMode } from "./context/DarkModeContext";

export default function App() {
    console.log("App rendered!");
    const { darkMode } = useDarkMode();

    return (
        <>
            <div className={darkMode ? "dark" : ""}>
                <div className="bg-background text-base-800 flex h-screen w-screen flex-col text-base ">
                    <OnLineProvider>
                        <ViewProvider>
                            <div className="flex grow overflow-clip">
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
            </div>
        </>
    );
}
