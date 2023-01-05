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

module.exports = {
    sleep,
    createPathIfDoesntExists,
    openLogsInFileExplorer,
    openFileExplorer,
};
