import React, { createContext, ReactNode, useContext, useState } from "react";

const ViewContext = createContext(
    {} as {
        view: string;
        setView: (view: string) => void;
    }
);

export function useView() {
    return useContext(ViewContext);
}

export function ViewProvider(props: { children: ReactNode }) {
    const [view, setView] = useState("search");

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {props.children}
        </ViewContext.Provider>
    );
}
