import fetch from "electron-fetch";
import { satisfies } from "compare-versions";
import { spawn } from "child_process";
import treeKill from "tree-kill";
import {
    initialize as initializeAptabase,
    trackEvent,
} from "@aptabase/electron/main";

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
import { get as getMainWindow } from "./windows/main-window";
import { mainLogger, logLevel } from "./utils/logger";
import path from "path";
import { initQueue } from "./services/library";
import {
    get as getUserPref,
    set as setUserPref,
    setLastMessageSeenTimestamp,
    getUserId,
} from "./model/user-preference";
import { NotImplementedError } from "./utils/errors";
import { getNewMessages } from "./lib/firebase";
const config = require(CONFIG_PATH);

let musicRemoverProcessId: number | undefined;
const lang = getUserPref("lang");

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

    musicRemoverProcess.stdout?.on("data", (data) => {
        mainLogger.debug(`musicRemoverProcess stdout: ${data}`);
    });
    musicRemoverProcess.stderr?.on("data", (data) => {
        mainLogger.debug(`musicRemoverProcess stderr: ${data}`);
    });
    musicRemoverProcess.on("close", (code) => {
        mainLogger.fatal(`🚨 Music remover process exited with code ${code}`);
    });

    // Save PID in order to terminate it on quit
    musicRemoverProcessId = musicRemoverProcess.pid;
}

export async function checkForUpdates() {
    try {
        const remotePackageReq = await fetch(
            "https://raw.githubusercontent.com/karim-bouchez/moubah/main/package.json"
        );
        const remotePackageJson = (await remotePackageReq.json()) as {
            version: string;
        };

        // For beta apps
        if (satisfies(app.getVersion(), ">" + remotePackageJson.version)) {
            mainLogger.debug(
                `Local v${app.getVersion()} > Main v${
                    remotePackageJson.version
                }`
            );
            return;
        }

        const skipVersion = getUserPref("skipVersion");
        if (
            skipVersion &&
            (satisfies(remotePackageJson.version, "<=" + skipVersion) ||
                satisfies(remotePackageJson.version, "^" + skipVersion))
        ) {
            mainLogger.debug(`Version v${skipVersion} skipped`);
            return;
        }

        let yesButton: string;
        let laterButton: string;
        let closeButton: string;
        let title: string;
        let message: string;
        switch (lang) {
            case "fr":
                yesButton = "Oui";
                laterButton = "Peut-être la prochaine version";
                closeButton = "Fermer";
                title = "Mise à jour disponible !";
                message = `Une mise à jour est disponible !

                    Voulez-vous visiter le site web Moubah et la télécharger maintenant ?
                    
                    Version actuelle : ${app.getVersion()}
                    Dernière version : ${remotePackageJson.version}
                `;
                break;
            case "ar":
                yesButton = "نعم";
                laterButton = "ربما الإصدار القادم";
                closeButton = "حذف";
                // TODO translation: check if it's really correct
                title = "التحديث متاح!";
                message = `تحديث متاح!

                    هل تود زيارة موقع Moubah وتنزيله الآن؟
                    
                    النسخة الحالية: ${app.getVersion()}
                    النسخة المحدثة: ${remotePackageJson.version}
                `;
                break;
            default:
                yesButton = "Yes";
                laterButton = "Maybe next version";
                closeButton = "Close";
                title = "Update available!";
                message = `An update is available!

                    Would you like to visit the Moubah website and download it now?
                    
                    Current version: ${app.getVersion()}
                    Updated version: ${remotePackageJson.version}
                `;
                break;
        }

        if (!satisfies(remotePackageJson.version, "^" + app.getVersion())) {
            const { response } = await dialog.showMessageBox(getMainWindow(), {
                type: "question",
                buttons: [yesButton, closeButton, laterButton],
                defaultId: 0,
                title: title,
                message: message,
            });

            switch (response) {
                case 0:
                    setUserPref("welcomMessageShown", false);
                    await shell.openExternal(
                        "https://github.com/karim-bouchez/moubah"
                    );
                    break;
                case 1:
                    // Do noting
                    break;
                case 2:
                    setUserPref("skipVersion", remotePackageJson.version);
                    break;
                default:
                    throw new NotImplementedError();
            }
        }
    } catch (err) {
        mainLogger.error(`Update check failed: ${err}`);
    }
}

export async function welcomMessage() {
    const welcomMessageShown = getUserPref("welcomMessageShown");
    if (welcomMessageShown) return;

    let message: string;
    switch (lang) {
        case "fr":
            message =
                "السلام عليكم ورحمة الله وبركاته 👋" +
                "\n\n" +
                "Bienvenue sur Moubah, l'application permettant de visionner des vidéos sans musique 🔇" +
                "\n\n" +
                "✅ Cette application a été conçue pour pouvoir profiter du contenu informatif et éducatif disponible sur internet (exemple : documentaires, actualités, tutoriels, etc.)" +
                "\n\n" +
                "❌ Non pas pour les vidéos dont le contenu est futile, voir illicite" +
                "\n\n" +
                "بارك الله فيكم 🤲";
            break;
        case "ar":
            message =
                "السلام عليكم ورحمة الله وبركاته 👋" +
                "\n\n" +
                "مرحبًا بكم في تطبيق Moubah لمشاهدة مقاطع الفيديو بدون موسيقى 🔇" +
                "\n\n" +
                "✅ تم تصميم هذا التطبيق ليكون قادرًا على الاستمتاع بالمحتوى التثقيفي والتعليمي المتاح على الإنترنت (مثل: الأفلام الوثائقية ، والأخبار ، والبرامج التعليمية ، وما إلى ذلك)" +
                "\n\n" +
                "❌ ليس لمقاطع الفيديو التي يكون محتواها تافهًا أو حتى غير مشروع" +
                "\n\n" +
                "بارك الله فيكم 🤲";
            break;
        default:
            message =
                "السلام عليكم ورحمة الله وبركاته 👋" +
                "\n\n" +
                "🔇 Welcome to Moubah, the app for watching videos without music" +
                "\n\n" +
                "✅ This application was designed to be able to enjoy informative and educational content available on the internet (example: documentaries, news, tutorials, etc.)" +
                "\n\n" +
                "❌ Not for videos whose content is frivolous or even illicit" +
                "\n\n" +
                "بارك الله فيكم 🤲";
            break;
    }
    try {
        await dialog.showMessageBox(getMainWindow(), {
            type: "info",
            message: message,
        });
        setUserPref("welcomMessageShown", true);
        setLastMessageSeenTimestamp(Date.now());
    } catch (err) {
        mainLogger.error(`Welcom message failed: ${err}`);
    }
}

export async function sendToastMessageToRenderer() {
    let messages;
    try {
        messages = await getNewMessages();
    } catch (error) {
        mainLogger.error(error);
        return;
    }
    messages.forEach((message) => {
        if (message === undefined) return;
        getMainWindow().webContents.send(
            "message:new",
            message.timestamp,
            message.type,
            message.text,
            message.link
        );
    });
}

export async function setUp() {
    initIpcHandlers();

    await initializeAptabase("A-EU-9813247449");
    trackEvent("open_app", { user_id: getUserId() });

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
