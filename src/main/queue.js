const ChunkRequestDTO = require("../dto/chunk-request");
const { removeMusic } = require("./lib/music-remover");

const queue = require("fastq").promise(worker, 1);


async function worker(chunkRequestDTO) {
    console.log("before");
    await removeMusic(chunkRequestDTO);
    console.log("after");
}

function push(queueName, chunkRequestDTO) {
    // const chunkRequestDTO = new ChunkRequestDTO({
    //     input_path: "aaa",
    //     output_path: "bbb",
    //     remove_original: false
    // })
    queue.push(chunkRequestDTO)
    queue.push(chunkRequestDTO)
}

module.exports = { push }
