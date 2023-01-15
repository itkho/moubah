import React from "react";
import Footer from "./Footer";
import MainView from "./MainView";
import NavBar from "./NavBar";

import { ViewProvider } from "./context/ViewContext";
import { LocalVideoProvider } from "./context/LocalVideoContext";

export default function App() {
    console.log("App mounted!");

    return (
        <>
            <div className="w-screen h-screen flex flex-col bg-background text-gray-3">
                <ViewProvider>
                    <div className="flex-grow flex">
                        <div className="basis-48">
                            <NavBar />
                        </div>

                        <div className="flex-grow">
                            <LocalVideoProvider>
                                <MainView />
                            </LocalVideoProvider>
                        </div>
                    </div>
                    <div className="basis-1">
                        <Footer />
                    </div>
                </ViewProvider>
            </div>
        </>
    );
}
