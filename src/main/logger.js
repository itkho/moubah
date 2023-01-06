const path = require("path");
const pino = require("pino");
const pretty = require("pino-pretty");

const { LOGS_DIR_PATH } = require("./const");
const MAIN_LOG_PATH = path.join(LOGS_DIR_PATH, "main-process.log");
const RENDERER_LOG_PATH = path.join(LOGS_DIR_PATH, "renderer-process.log");

const mainStreams = [
    pretty({
        colorize: true,
        destination: 1, // stdout
        ignore: "pid,hostname",
        messageFormat: (log, messageKey) => ` 🔌  ${log[messageKey]}`,
    }),
    pretty({
        colorize: false,
        destination: MAIN_LOG_PATH,
        sync: true,
        append: false,
        ignore: "pid,hostname",
    }),
];
const mainLogger = pino({}, pino.multistream(mainStreams));

const rendererStreams = [
    pretty({
        colorize: true,
        destination: 1, // stdout
        ignore: "pid,hostname",
        messageFormat: (log, messageKey) => ` 🖥  ${log[messageKey]}`,
    }),
    pretty({
        colorize: false,
        destination: RENDERER_LOG_PATH,
        sync: true,
        append: false,
        ignore: "pid,hostname",
    }),
];
const rendererLogger = pino({}, pino.multistream(rendererStreams));

rendererLogger.fatal(`PINO_LOG_LEVEL: ${process.env.PINO_LOG_LEVEL}`);
rendererLogger.fatal(`NODE_ENV: ${process.env.NODE_ENV}`);

process.on("uncaughtException", (err) => {
    mainLogger.error(err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    mainLogger.error(err);
    process.exit(1);
});

module.exports = { mainLogger, rendererLogger };
