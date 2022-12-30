const { spawn } = require("child_process");

const initIpcHandlers = require("./ipc-handlers");
const {
    EXEC_EXTENSION,
    IS_APPLE_SILICON,
    MUSIC_REMOVER_DIR,
    RESOURCE_DIR,
    PYTHON_DIR,
    PATH_SEPARATOR,
} = require("./const");
const LibraryService = require("./services/library");

function startMusicRemoverProcess() {
    let backendProcess;
    if (IS_APPLE_SILICON) {
        try {
            backendProcess = spawn("arch", ["-x86_64", "python", "app.py"], {
                cwd: MUSIC_REMOVER_DIR,
                env: {
                    PATH: `${PYTHON_DIR}${PATH_SEPARATOR}${process.env.PATH}`,
                },
            });
        } catch (error) {
            console.error(error);
        }
    } else {
        const exec_name = "./app" + EXEC_EXTENSION;
        backendProcess = spawn(exec_name, { cwd: RESOURCE_DIR });
    }

    backendProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    backendProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    backendProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

async function setUp() {
    initIpcHandlers();
    startMusicRemoverProcess();
    // LibraryService.initQueue();
}

function tearDown() {}

module.exports = {
    setUp,
    tearDown,
};
