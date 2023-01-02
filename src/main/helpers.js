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

function run(cmd) {
    // TODO: Not sure why it's here exactly??
    // duplicated of logic from main-window.js -> create() ??
    // ------------------------------------------------------
    const logPath = path.join(LOGS_DIR_PATH, "ui.log");
    const logFile = fs.createWriteStream(logPath, { flags: "w" });
    const logStdout = process.stdout;

    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + "\n");
        logStdout.write(util.format.apply(null, arguments) + "\n");
    };
    console.error = console.log;
    // ------------------------------------------------------

    return exec(cmd, (error, stdout, stderr) => {
        console.log(
            "\n-------------\n",
            "stdout: " + stdout,
            "\n-------------\n"
        );
        console.log(
            "\n-------------\n",
            "stderr: " + stderr,
            "\n-------------\n"
        );
        if (error !== null) {
            console.log("exec error: " + error);
        }
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
    run,
    sleep,
    createPathIfDoesntExists,
    openLogsInFileExplorer,
    openFileExplorer,
};
