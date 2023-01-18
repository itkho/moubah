import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const OnLineContext = createContext(
    {} as {
        onLine: boolean;
    }
);

export function useOnLine() {
    return useContext(OnLineContext);
}

export function OnLineProvider(props: { children: ReactNode }) {
    const [onLine, setOnLine] = useState(false);

    useEffect(() => {
        setOnLine(navigator.onLine);
        window.addEventListener("online", () => setOnLine(true));
        window.addEventListener("offline", () => setOnLine(false));

        return () => {
            window.removeEventListener("online", () => setOnLine(true));
            window.removeEventListener("offline", () => setOnLine(false));
        };
    }, []);

    return (
        <OnLineContext.Provider value={{ onLine }}>
            {props.children}
        </OnLineContext.Provider>
    );
}
