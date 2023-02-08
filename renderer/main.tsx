import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import initIpcHandlers from "./ipc-handlers";
import { DarkModeProvider } from "./context/DarkModeContext";

initIpcHandlers();

ReactDOM.render(
    <React.StrictMode>
        <DarkModeProvider>
            <App />
        </DarkModeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
