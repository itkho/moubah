const { spawn } = require("child_process");

const initIpcHandlers = require('./ipc-handlers');
const { EXEC_EXTENSION, IS_APPLE_SILICON } = require("./const");
const LibraryService = require("./services/library");


function startMusicRemoverProcess() {
    // TODO: finish the implementation
    if (IS_APPLE_SILICON) {
        const backendProcess = spawn("python", ["app.py"], { cwd: BACKEND_DIR });
    } else {
        const exec_name = "./app" + EXEC_EXTENSION;
        const backendProcess = spawn(exec_name, { cwd: BACKEND_BIN_DIR });
    }

    backendProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}


async function setUp() {
    initIpcHandlers();
    // startMusicRemoverProcess();
    LibraryService.initQueue();
}

function tearDown() {
}

module.exports = {
    setUp, tearDown
}