import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";
import { Locale } from "../utils/enums";

const LocaleContext = createContext(
    {} as {
        locale: Locale;
        setLocale: Dispatch<SetStateAction<Locale>>;
    }
);

export function useLocale() {
    return useContext(LocaleContext);
}

export function LocaleProvider(props: { children: ReactNode }) {
    const [locale, setLocale] = useState(Locale.fr);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {props.children}
        </LocaleContext.Provider>
    );
}
