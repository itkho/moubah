const { spawn } = require("child_process");

const initIpcHandlers = require('./ipc-handlers');
const { BACKEND_BIN_DIR } = require("./const");
const LibraryService = require("./services/library");


function startMusicRemoverProcess() {
    // const pythonPrefix = isMacM1 ? "arch -x86_64 " : "";
    // const backendProcess = spawn(pythonPrefix + "python", ["app.py"], { cwd: BACKEND_DIR });
    const exec_name = isWindows ? "./app.exe" : "./app";
    const backendProcess = spawn(exec_name, { cwd: BACKEND_BIN_DIR });

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
    LibraryService.initQueue();
    // TODO: handle this on gRPC response
    LibraryService.initSub();
}

function tearDown() {
}

module.exports = {
    setUp, tearDown
}