const path = require("path");
const pino = require("pino");
const pretty = require("pino-pretty");

const { LOGS_DIR_PATH } = require("./const");
const MAIN_LOG_PATH = path.join(LOGS_DIR_PATH, "main-process.log");
const RENDERER_LOG_PATH = path.join(LOGS_DIR_PATH, "renderer-process.log");

const logLevel = process.env.PINO_LOG_LEVEL || "info";
const logLevelMin = "debug"; // doesn't work if we don't set the level to the minimum here

const mainStreams = [
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
const mainLogger = pino({ level: logLevel }, pino.multistream(mainStreams));

const rendererStreams = [
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
const rendererLogger = pino(
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

module.exports = { mainLogger, rendererLogger };
