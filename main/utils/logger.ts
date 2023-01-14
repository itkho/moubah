import path from "path";
import pino from "pino";
import pretty from "pino-pretty";
import { ChildProcess } from "child_process";

import { LOGS_DIR_PATH } from "./const";
const MAIN_LOG_PATH = path.join(LOGS_DIR_PATH, "main-process.log");
const RENDERER_LOG_PATH = path.join(LOGS_DIR_PATH, "renderer-process.log");

export const logLevel = process.env.PINO_LOG_LEVEL || "info";

// A logLevel below "info" doesn't work if we don't set the level to the minimum here:
const logLevelMin = "debug";

const mainStreams: any = [
    {
        level: logLevelMin,
        stream: pretty({
            colorize: true,
            destination: 1, // stdout
            ignore: "pid,hostname",
            messageFormat: (log, messageKey) => ` 🔌  ${log[messageKey]}`,
        }),
    },
    {
        level: logLevelMin,
        stream: pretty({
            colorize: false,
            destination: MAIN_LOG_PATH,
            sync: true,
            append: false,
            ignore: "pid,hostname",
        }),
    },
];
export const mainLogger = pino(
    { level: logLevel },
    pino.multistream(mainStreams)
);

const rendererStreams: any = [
    {
        level: logLevelMin,
        stream: pretty({
            colorize: true,
            destination: 1, // stdout
            ignore: "pid,hostname",
            messageFormat: (log, messageKey) => ` 🖥  ${log[messageKey]}`,
        }),
    },
    {
        level: logLevelMin,
        stream: pretty({
            colorize: false,
            destination: RENDERER_LOG_PATH,
            sync: true,
            append: false,
            ignore: "pid,hostname",
        }),
    },
];
export const rendererLogger = pino(
    { level: logLevel },
    pino.multistream(rendererStreams)
);

process.on("uncaughtException", (err) => {
    mainLogger.error(err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    mainLogger.error(err);
    process.exit(1);
});

export function logSpawn(
    process: ChildProcess,
    logger: pino.Logger,
    prefix = ""
) {
    // I didn't manage to pass the log level as a parameter
    process.stdout?.on("data", (data) => {
        logger.debug(`${prefix} stdout: ${data}`);
    });
    process.stderr?.on("data", (data) => {
        logger.debug(`${prefix} stderr: ${data}`);
    });
    process.on("close", (code) => {
        logger.debug(`child process ${prefix} exited with code ${code}`);
    });
}
