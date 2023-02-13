import React from "react";
import Footer from "./components/Footer";
import MainView from "./views/MainView";
import NavBar from "./components/NavBar";

import { ViewProvider } from "./context/ViewContext";
import { LocalVideoProvider } from "./context/LocalVideoContext";
import { PlayerProvider } from "./context/PlayerContext";
import { OnLineProvider } from "./context/OnlineContext";
import { useDarkMode } from "./context/DarkModeContext";

import { Trans } from "@lingui/macro";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { fr, en } from "make-plural/plurals";

i18n.loadLocaleData("fr", { plurals: fr });
i18n.loadLocaleData("en", { plurals: en });

type Local = "fr" | "en";

/**
 * Load messages for requested locale and activate it.
 */
async function activateLocale(locale: Local) {
    const { messages } = await import(`./locales/${locale}/messages.ts`);
    i18n.load(locale, messages);
    i18n.activate(locale);
}

activateLocale("fr");

export default function App() {
    console.log("App rendered!");
    const { darkMode } = useDarkMode();

    return (
        <>
            <I18nProvider i18n={i18n}>
                <div className={darkMode ? "dark" : ""}>
                    <div className="bg-background text-base-800 flex h-screen w-screen flex-col text-base ">
                        <OnLineProvider>
                            <ViewProvider>
                                <div className="flex grow overflow-clip">
                                    <NavBar />
                                    <LocalVideoProvider>
                                        <PlayerProvider>
                                            <Trans>
                                                Hello Vite + React + LinguiJS!
                                            </Trans>

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
