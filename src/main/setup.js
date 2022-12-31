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
const { ping: pingMusicRemover } = require("./lib/music-remover");
const { sleep } = require("./helpers.js");
const config = require(CONFIG_PATH);

let musicRemoverProcess;

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
        const exec_name = "./app" + EXEC_EXTENSION;
        musicRemoverProcess = spawn(exec_name, { cwd: RESOURCE_DIR });
    }

    musicRemoverProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    musicRemoverProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    musicRemoverProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
    console.log(musicRemoverProcess.pid);
}

async function setUp() {
    initIpcHandlers();
    startMusicRemoverProcess();
    pingMusicRemover({ recursive: true }).then(async () => {
        console.log("gRPC server UP!");
        LibraryService.initQueue();

        // console.log("Killing 'musicRemoverProcess'...");
        // await sleep(3000);
        // console.log(musicRemoverProcess.pid);
        // kill(musicRemoverProcess.pid, function (err) {
        //     if (err) console.error({ err });
        // });
        // console.log("DONE 'musicRemoverProcess'...");
    });
}

async function tearDown() {
    if (musicRemoverProcess) {
        try {
            // TODO: check why the process isn't kill sometimes (the main process is killed before?)
            await kill(musicRemoverProcess.pid, "SIGTERM");
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
