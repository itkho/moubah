const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_FILE = path.join(__dirname, "../protobuf/moubah.proto");
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);

const MusicRemover = grpc.loadPackageDefinition(pkgDefs).MusicRemover;

const config = require(path.join(__dirname, "../protobuf/config.json"));
const client = new MusicRemover(
    `${config["url"]}:${config["port"]}`,
    grpc.credentials.createInsecure()
);

function removeMusic(chunkRequestDTO) {
    return new Promise((resolve, reject) =>
        client.RemoveMusic(chunkRequestDTO, (err, response) => {
            if (err) {
                return reject(err);
            }
            resolve(response);
        })
    );
}

async function pingAppReady(recursive = true) {
    return new Promise(async (resolve, reject) => {
        // Ping the path e.g http://localhost:3000
        const [err] = await to(axios.get(healthCheckPath));

        // resolve if the ping returns no error or error that is not related to the connection
        if (!err) return resolve();
        if (err.code !== "ECONNREFUSED") return resolve();

        if (!recursive) reject();

        setTimeout(async () => {
            await pingAppReady(healthCheckPath, recursive);
            resolve();
        }, 5000);
    });
}

module.exports = { removeMusic };
