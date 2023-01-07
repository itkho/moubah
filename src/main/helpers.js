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

function logSpawn(process, logger, prefix = "") {
    // I didn't manage to pass the log level as a parameter
    process.stdout.on("data", (data) => {
        logger.debug(`${prefix} stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
        logger.debug(`${prefix} stderr: ${data}`);
    });
    process.on("close", (code) => {
        logger.debug(`child process ${prefix} exited with code ${code}`);
    });
}

module.exports = {
    sleep,
    createPathIfDoesntExists,
    openLogsInFileExplorer,
    openFileExplorer,
    logSpawn,
};
