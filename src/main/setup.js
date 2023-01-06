const { spawn } = require("child_process");
const treeKill = require("tree-kill");
const util = require("util");
const kill = util.promisify(treeKill);

const initIpcHandlers = require("./ipc-handlers");
const {
    EXEC_EXTENSION,
    IS_APPLE_SILICON,
    MUSIC_REMOVER_DIR,
    RESOURCE_DIR,
    PYTHON_DIR,
    PATH_SEPARATOR,
    CONFIG_PATH,
} = require("./const");
const LibraryService = require("./services/library");
const { ping: pingMusicRemover, getProcessId } = require("./lib/music-remover");
const { MusicRemoverStatus } = require("./enum");
const { getMainWindow } = require("../main-window");
const { mainLogger } = require("./logger");
const { logSpawn } = require("./helpers");
const config = require(CONFIG_PATH);

let musicRemoverProcessId;

function startMusicRemoverProcess() {
    function startFromSource() {
        return spawn(
            "arch",
            [
                "-x86_64",
                "python",
                "app.py",
                "--host",
                config["grpc"]["host"],
                "--port",
                config["grpc"]["port"],
            ],
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
        return spawn(
            exec_name,
            [
                "--host",
                config["grpc"]["host"],
                "--port",
                config["grpc"]["port"],
            ],
            { cwd: RESOURCE_DIR }
        );
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
    logSpawn(musicRemoverProcess, mainLogger.debug, "music-remover");

    // Save PID in order to terminate it on quit
    musicRemoverProcessId = musicRemoverProcess.pid;
}

async function setUp() {
    initIpcHandlers();

    // Test is the server isn't already up (from a previous session)
    try {
        musicRemoverProcessId = await getProcessId();
        mainLogger.warn("gRPC server already UP!");
    } catch (error) {
        startMusicRemoverProcess();
    }

    pingMusicRemover({ recursive: true }).then(() => {
        mainLogger.info("gRPC server UP!");
        LibraryService.initQueue();
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

async function tearDown() {
    if (musicRemoverProcessId) {
        try {
            // TODO: check why the process isn't kill sometimes (the main process is killed before?)
            mainLogger.info("Killing 'musicRemoverProcess'...");
            await kill(musicRemoverProcessId, "SIGTERM");
            mainLogger.info("'musicRemoverProcess' killed");
        } catch (error) {
            mainLogger.error(error);
        }
    }
}

module.exports = {
    setUp,
    tearDown,
};
