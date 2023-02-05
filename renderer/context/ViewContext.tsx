import React, { createContext, ReactNode, useContext, useState } from "react";
import { View } from "../utils/enums";

const ViewContext = createContext(
    {} as {
        view: string;
        setView: (view: View) => void;
    }
);

export function useView() {
    return useContext(ViewContext);
}

export function ViewProvider(props: { children: ReactNode }) {
    const [view, setView] = useState(View.library);

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {props.children}
        </ViewContext.Provider>
    );
}
