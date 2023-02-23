import React, { useEffect } from "react";
import Footer from "./components/Footer";
import MainView from "./views/MainView";
import NavBar from "./components/NavBar";

import { ViewProvider } from "./context/ViewContext";
import { LocalVideoProvider } from "./context/LocalVideoContext";
import { PlayerProvider } from "./context/PlayerContext";
import { OnLineProvider } from "./context/OnlineContext";
import { useDarkMode } from "./context/DarkModeContext";

import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { fr, en, ar } from "make-plural/plurals";
import { useLocale } from "./context/LocaleContext";
import { Locale } from "./utils/enums";

i18n.loadLocaleData("fr", { plurals: fr });
i18n.loadLocaleData("en", { plurals: en });
i18n.loadLocaleData("ar", { plurals: ar });

/**
 * Load messages for requested locale and activate it.
 */
async function activateLocale(locale: Locale) {
    const { messages } = await import(`./locales/${locale}/messages.ts`);
    i18n.load(locale, messages);
    i18n.activate(locale);
}

const defaultLang = navigator.language.split("-")[0];

activateLocale(defaultLang as Locale);

export default function App() {
    const { darkMode } = useDarkMode();
    const { locale } = useLocale();

    useEffect(() => {
        // TODO: for now, I didn't managed to move this to LocaleContexte
        activateLocale(locale);
    }, [locale]);

    return (
        <>
            <I18nProvider i18n={i18n}>
                <div className={darkMode ? "dark" : ""}>
                    <div className="bg-background text-base-800 -z-40 flex h-screen w-screen flex-col font-rubik text-base">
                        <OnLineProvider>
                            <ViewProvider>
                                <div className="flex grow overflow-clip">
                                    <NavBar />
                                    <LocalVideoProvider>
                                        <PlayerProvider>
                                            <MainView />
                                        </PlayerProvider>
                                    </LocalVideoProvider>
                                </div>
                            </ViewProvider>
                            <Footer />
                        </OnLineProvider>
                    </div>
                </div>
            </I18nProvider>
        </>
    );
}
