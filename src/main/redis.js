const detect = require('detect-port');
const Redis = require("ioredis");
const { spawn } = require("child_process");
const EventEmitter = require("events");

const { REDIS_BIN_DIR, REDIS_PORT } = require('./const');


const eventEmitter = new EventEmitter();
let client;
let subscriber;

async function startServer() {
    // TODO: use promises
    const freePort = await detect(REDIS_PORT);
    if (REDIS_PORT == freePort) {
        console.log(`port: ${REDIS_PORT} was not occupied`);
        spawn("./redis-server", ["--save"], { cwd: REDIS_BIN_DIR });
        // Don't need to wait for the server to be up and running
        // ioredis take care of this for us.
        connect();
    } else {
        console.log(`port: ${REDIS_PORT} was occupied, try port: ${freePort}`);
    }
}

async function connect() {
    // TODO: add custom Redis config
    client = new Redis();
    subscriber = new Redis();
    client.on("ready", _ => {
        // TODO: return a Promise and take this function out of "connect()"
        createBackendUser();
        console.log("client ready");
        eventEmitter.emit("redis_ready");
    });

}

function createBackendUser() {
    // TODO: save backend / password in config file or something
    // + bonus: restrain access to channels/commands
    client.acl("SETUSER", "backend", "ON", ">" + "password", "~*", "&*", "+@all");
}

async function getConnectedUsers() {
    const client_list_res = await client['client']('list');
    const client_list = client_list_res.split("\n").slice(0, -1)
    const user_list = client_list.map(client => client.match(/user=(.*?) /)[1]);
    return user_list;
}

function pushToQueue(queueName, chunkRequestDTO) {
    client.lpush(queueName, JSON.stringify(chunkRequestDTO));
}

function subscribeChannel(channel, callback) {
    subscriber.subscribe(channel);
    subscriber.on("message", (_channel, message) => callback(message));
}

async function stopServer() {
    spawn("./redis-cli", ["shutdown"], { cwd: REDIS_BIN_DIR });
    console.log("Redis server stopped!");
}


module.exports = { startServer, stopServer, redisClient: client, pushToQueue, subscribeChannel, getConnectedUsers, redisEventEmitter: eventEmitter }