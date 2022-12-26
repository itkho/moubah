const { exec } = require("child_process");
const { app } = require("electron");
const fs = require('fs');
const path = require("path");
const util = require('util');


function createPathIfDoesntExists(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

function run(cmd) {

    // TODO: Not sure why it's here exactly??
    // duplicated of logic from main-window.js -> create() ??
    // ------------------------------------------------------
    const logPath = path.join(app.getPath("logs"), "ui.log");
    const logFile = fs.createWriteStream(logPath, { flags: 'w' });
    const logStdout = process.stdout;

    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + '\n');
        logStdout.write(util.format.apply(null, arguments) + '\n');
    }
    console.error = console.log;
    // ------------------------------------------------------

    return exec(cmd, (error, stdout, stderr) => {
        console.log("\n-------------\n", 'stdout: ' + stdout, "\n-------------\n");
        console.log("\n-------------\n", 'stderr: ' + stderr, "\n-------------\n");
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
    run, sleep, createPathIfDoesntExists
}