import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import initIpcHandlers from "./ipc-handlers";
import { DarkModeProvider } from "./context/DarkModeContext";
import { LocaleProvider } from "./context/LocaleContext";

initIpcHandlers();

ReactDOM.render(
    <React.StrictMode>
        <LocaleProvider>
            <DarkModeProvider>
                <App />
            </DarkModeProvider>
        </LocaleProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
