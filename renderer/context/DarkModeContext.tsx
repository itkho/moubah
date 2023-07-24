import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

const DarkModeContext = createContext(
    {} as {
        darkMode: boolean;
        changeDarkMode: (dark: boolean) => void;
    }
);

export function useDarkMode() {
    return useContext(DarkModeContext);
}

export function DarkModeProvider(props: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        window.mainApi.getUserPrefDarkMode().then((dark) => {
            setDarkMode(dark);
        });
    }, []);

    function changeDarkMode(dark: boolean) {
        window.mainApi.setUserPrefDarkMode(dark);
        setDarkMode(dark);
    }

    return (
        <DarkModeContext.Provider value={{ darkMode, changeDarkMode }}>
            {props.children}
        </DarkModeContext.Provider>
    );
}
