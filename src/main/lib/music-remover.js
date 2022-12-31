const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { CONFIG_PATH } = require("../const");

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

const config = require(CONFIG_PATH);
const client = new MusicRemover(
    `${config["host"]}:${config["port"]}`,
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

async function ping({ recursive = true }) {
    return new Promise(async (resolve, reject) => {
        client.Ping({}, (err, _) => {
            if (!err) {
                return resolve();
            } else {
                console.log("gRPC: " + err.details);
                if (!recursive) reject();
                setTimeout(async () => {
                    await ping(recursive);
                    resolve();
                }, 1000);
            }
        });
    });
}

module.exports = { removeMusic, ping };
