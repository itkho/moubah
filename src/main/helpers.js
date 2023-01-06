const { shell } = require("electron");
const fs = require("fs");
const { LOGS_DIR_PATH } = require("./const");

function createPathIfDoesntExists(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

function openLogsInFileExplorer() {
    openFileExplorer(LOGS_DIR_PATH);
}

function openFileExplorer(path) {
    shell.showItemInFolder(path);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function logSpawn(process, loggerFunc, prefix = "") {
    process.stdout.on("data", (data) => {
        loggerFunc(`${prefix} stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
        loggerFunc(`${prefix} stderr: ${data}`);
    });
    process.on("close", (code) => {
        loggerFunc(`child process ${prefix} exited with code ${code}`);
    });
}

module.exports = {
    sleep,
    createPathIfDoesntExists,
    openLogsInFileExplorer,
    openFileExplorer,
    logSpawn,
};
