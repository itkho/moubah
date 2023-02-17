import fetch from "electron-fetch";
import { satisfies } from "compare-versions";
import { spawn } from "child_process";
import treeKill from "tree-kill";

import { app, dialog, shell } from "electron";

import initIpcHandlers from "./ipc-handlers";
import {
    EXEC_EXTENSION,
    IS_APPLE_SILICON,
    MUSIC_REMOVER_DIR,
    MUSIC_REMOVER_EXE_DIR,
    PYTHON_DIR,
    PATH_SEPARATOR,
    CONFIG_PATH,
    LOGS_DIR_PATH,
} from "./utils/const";
import { ping as pingMusicRemover, getProcessId } from "./lib/music-remover";
import { MusicRemoverStatus } from "./utils/enum";
import { get as getMainWindow } from "./main-window";
import { mainLogger, logLevel } from "./utils/logger";
import path from "path";
import { initQueue } from "./services/library";
import { get as getUserPref } from "./model/user-preference";
const config = require(CONFIG_PATH);

let musicRemoverProcessId: number | undefined;

function startMusicRemoverProcess() {
    const musicRemoverOptions = [
        "--host",
        config["grpc"]["host"],
        "--port",
        config["grpc"]["port"],
        "--log_path",
        path.join(LOGS_DIR_PATH, "music-remover.log"),
        "--log_level",
        logLevel.toUpperCase(),
    ];

    function startFromSource() {
        return spawn(
            "arch",
            ["-x86_64", "python", "app.py"].concat(musicRemoverOptions),
            {
                cwd: MUSIC_REMOVER_DIR,
                env: {
                    PATH: `${PYTHON_DIR}${PATH_SEPARATOR}${process.env.PATH}`,
                },
            }
        );
    }

    function startFromExec() {
        const exec_name = "./music-remover" + EXEC_EXTENSION;
        return spawn(exec_name, musicRemoverOptions, {
            cwd: MUSIC_REMOVER_EXE_DIR,
        });
    }

    let musicRemoverProcess;
    try {
        // The executable file doesn't work on Apple silicon for the moment
        if (IS_APPLE_SILICON) {
            musicRemoverProcess = startFromSource();
        } else {
            musicRemoverProcess = startFromExec();
        }
    } catch (error) {
        mainLogger.error(error);
        return;
    }

    musicRemoverProcess.on("close", (code) => {
        mainLogger.fatal(`🚨 Music remover process exited with code ${code}`);
    });

    // Save PID in order to terminate it on quit
    musicRemoverProcessId = musicRemoverProcess.pid;
}

async function checkForUpdates() {
    try {
        const remotePackageReq = await fetch(
            "https://raw.githubusercontent.com/karim-bouchez/moubah/main/package.json"
        );
        const remotePackageJson = (await remotePackageReq.json()) as {
            version: string;
        };

        if (satisfies(app.getVersion(), ">" + remotePackageJson.version)) {
            mainLogger.info(
                `Local v${app.getVersion()} > Main v${
                    remotePackageJson.version
                }`
            );
            return;
        }

        let yesButton: string;
        let noButton: string;
        let title: string;
        let message: string;
        const lang = getUserPref("lang") || "en";
        switch (lang) {
            case "fr":
                yesButton = "Oui";
                noButton = "Non";
                title = "Mise à jour disponible !";
                message = `Une mise à jour est disponible !

                    Voulez-vous visiter le site web Moubah et la télécharger maintenant ?
                    
                    Version actuelle : ${app.getVersion()}
                    Dernière version : ${remotePackageJson.version}
                `;
                break;
            case "ar":
                // TODO translation: check if it's really correct
                yesButton = "نعم";
                noButton = "لا";
                title = "التحديث متاح!";
                message = `تحديث متاح!

                    هل تود زيارة موقع Moubah وتنزيله الآن؟
                    
                    النسخة الحالية: ${app.getVersion()}
                    النسخة المحدثة: ${remotePackageJson.version}
                `;
                break;
            default:
                yesButton = "Yes";
                noButton = "No";
                title = "Update available!";
                message = `An update is available!

                    Would you like to visit the Moubah website and download it now?
                    
                    Current version: ${app.getVersion()}
                    Updated version: ${remotePackageJson.version}
                `;
                break;
        }

        // WARNING: this will only work start from v1.x.x
        // > satisfies('0.1.0', '^0.0.1');
        // false
        // > satisfies('10.1.0', '^10.0.1');
        // true
        if (!satisfies(remotePackageJson.version, "^" + app.getVersion())) {
            const { response } = await dialog.showMessageBox(getMainWindow(), {
                type: "info",
                buttons: [yesButton, noButton],
                defaultId: 0,
                title: title,
                message: message,
            });

            // TODO: add a "checkboxLabel" and skip the reminder every time
            // for this version if the user doesn't want to update
            if (response === 0) {
                await shell.openExternal(
                    "https://github.com/karim-bouchez/moubah"
                );
            }
        }
    } catch (err) {
        mainLogger.error(`Update check failed: ${err}`);
    }
}

export async function setUp() {
    checkForUpdates();
    initIpcHandlers();

    // Test if the server isn't already up (from a previous session)
    try {
        musicRemoverProcessId = await getProcessId();
        mainLogger.warn("gRPC server already UP!");
    } catch (error) {
        startMusicRemoverProcess();
    }

    pingMusicRemover({ recursive: true }).then(() => {
        mainLogger.info("gRPC server UP! ✅");
        initQueue();
        // TODO: remove this setTimeout, and wait for the renderer to finish before firing this event
        // Delay of 1 second because the renderer process may not be ready yet
        setTimeout(() => {
            getMainWindow().webContents.send(
                "music-remover:status:updated",
                MusicRemoverStatus.up
            );
        }, 1000);
    });
}

export function tearDown() {
    if (musicRemoverProcessId) {
        try {
            // TODO: check why the process isn't kill sometimes (the main process is killed before?)
            mainLogger.info("Killing 'musicRemoverProcess'...");
            treeKill(musicRemoverProcessId, "SIGTERM");
            mainLogger.info("'musicRemoverProcess' killed");
        } catch (error) {
            mainLogger.error(error);
        }
    }
}
