const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_FILE = "src/main/protobuf/moubah.proto";
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);

const MusicRemover = grpc.loadPackageDefinition(pkgDefs).MusicRemover;
const client = new MusicRemover(
    "localhost:50051",
    grpc.credentials.createInsecure()
);


function removeMusic(chunkRequestDTO) {
    return new Promise((resolve, reject) => client.RemoveMusic(chunkRequestDTO, (err, response) => {
        if (err) {
            return reject(err)
        }
        resolve(response)
    }))
}

module.exports = { removeMusic }