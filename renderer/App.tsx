import React from "react";
import Footer from "./Footer";
import MainView from "./MainView";
import NavBar from "./NavBar";

import { ViewProvider } from "./ViewContext";

export default function App() {
    console.log("App mounted!");

    return (
        <>
            <div className="w-screen h-screen flex flex-col">
                <ViewProvider>
                    <div className="flex-grow flex">
                        <div className="basis-48">
                            <NavBar />
                        </div>

                        <div className="flex-grow">
                            <MainView />
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
