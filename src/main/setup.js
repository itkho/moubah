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
const { sleep } = require("./helpers.js");
const { MusicRemoverStatus } = require("./enum");
const { getMainWindow } = require("../main-window");
const { mainLogger } = require("./logger");
const config = require(CONFIG_PATH);

let musicRemoverProcess;
let musicRemoverProcessId;

function startMusicRemoverProcess() {
    if (IS_APPLE_SILICON) {
        try {
            musicRemoverProcess = spawn(
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
        } catch (error) {
            console.error(error);
        }
    } else {
        const exec_name = "./music-remover" + EXEC_EXTENSION;
        musicRemoverProcess = spawn(
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
    const musicRemoverLogger = mainLogger.child({
        process: "music-remover",
    });

    musicRemoverProcess.stdout.on("data", (data) => {
        musicRemoverLogger.info(data);
    });

    musicRemoverProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    musicRemoverProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

async function setUp() {
    initIpcHandlers();

    // Test is the server isn't already up (from a previous session)
    try {
        musicRemoverProcessId = await getProcessId();
        console.log("gRPC server already UP!");
    } catch (error) {
        startMusicRemoverProcess();
    }

    pingMusicRemover({ recursive: true }).then(() => {
        console.log("gRPC server UP!");
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
    if (musicRemoverProcess) musicRemoverProcessId = musicRemoverProcess.pid;
    if (musicRemoverProcessId) {
        try {
            // TODO: check why the process isn't kill sometimes (the main process is killed before?)
            console.log("Killing 'musicRemoverProcess'...");
            await kill(musicRemoverProcessId, "SIGTERM");
            console.log("'musicRemoverProcess' killed");
        } catch (error) {
            console.error({ error });
        }
    }
}

module.exports = {
    setUp,
    tearDown,
};
