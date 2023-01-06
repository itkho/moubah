const pino = require("pino");
const pretty = require("pino-pretty");

const streams = [
    // {stream: fs.createWriteStream(`${logdir}/info.log`, {flags: 'a'})},
    { level: "debug", stream: pretty({ colorize: true }) },
    // {level: 'error', stream: fs.createWriteStream(`${logdir}/error.log`, {flags: 'a'})},
    // {level: 'debug', stream: fs.createWriteStream(`${logdir}/debug.log`, {flags: 'a'})},
    // {level: 'fatal', stream: fs.createWriteStream(`${logdir}/fatal.log`, {flags: 'a'})}
];

const stream = pretty({
    colorize: true,
    level: "debug",
});

const levels = {
    emerg: 80,
    alert: 70,
    crit: 60,
    error: 50,
    warn: 40,
    notice: 30,
    info: 20,
    debug: 10,
};

const logger = pino(
    {
        level: "debug",
        // customLevels: levels,
        // useOnlyCustomLevels: true,
    },
    // stream
    pino.multistream(streams)
);

// Nothing is printed
logger.debug("debug");
logger.info("info");
// logger.emerg("emerg");
