const { exec } = require("child_process");
const { shell } = require("electron");
const fs = require("fs");
const path = require("path");
const util = require("util");
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
    process.stdout.on("data", (data) => {
        logger.info(`${prefix} stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
        logger.error(`${prefix} stderr: ${data}`);
    });
    process.on("close", (code) => {
        logger.info(`child process ${prefix} exited with code ${code}`);
    });
}

module.exports = {
    sleep,
    createPathIfDoesntExists,
    openLogsInFileExplorer,
    openFileExplorer,
    logSpawn,
};
