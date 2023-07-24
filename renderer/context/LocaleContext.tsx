import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { Locale } from "../utils/enums";

const LocaleContext = createContext(
    {} as {
        locale: Locale;
        changeLocale: (locale: Locale) => void;
    }
);

export function useLocale() {
    return useContext(LocaleContext);
}

const defaultLang = navigator.language.split("-")[0];

export function LocaleProvider(props: { children: ReactNode }) {
    const [locale, setLocale] = useState(defaultLang as Locale);

    useEffect(() => {
        window.mainApi.getUserPrefLang().then((lang) => {
            if (lang) setLocale(lang as Locale);
        });
    }, []);

    function changeLocale(locale: Locale) {
        window.mainApi.setUserPrefLang(locale);
        setLocale(locale);
    }

    return (
        <LocaleContext.Provider value={{ locale, changeLocale }}>
            {props.children}
        </LocaleContext.Provider>
    );
}
