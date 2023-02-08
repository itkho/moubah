import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

const DarkModeContext = createContext(
    {} as {
        darkMode: boolean;
        setDarkMode: Dispatch<SetStateAction<boolean>>;
    }
);

export function useDarkMode() {
    return useContext(DarkModeContext);
}

export function DarkModeProvider(props: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
            {props.children}
        </DarkModeContext.Provider>
    );
}
