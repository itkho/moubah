import React, { createContext, useContext, useState } from "react";

const ViewContext = createContext("");
const ViewUpdateContext = createContext<any>(null);

export function useView() {
    return useContext(ViewContext);
}

export function useViewUpdate() {
    return useContext(ViewUpdateContext);
}

export function ViewProvider(props: any) {
    const [view, setView] = useState("search");

    return (
        <ViewContext.Provider value={view}>
            <ViewUpdateContext.Provider value={setView}>
                {props.children}
            </ViewUpdateContext.Provider>
        </ViewContext.Provider>
    );
}
