import { spawn } from "child_process";
import treeKill from "tree-kill";

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

export async function setUp() {
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
