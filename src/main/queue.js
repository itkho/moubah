const fastq = require("fastq");
const { mainLogger } = require("./logger");
let queue;

function addWorkerToQueue(queueName, worker) {
    if (queue) {
        mainLogger.warn("A worker is already associated with this queue");
        return;
    }
    queue = fastq.promise(worker, 1);
}

function pushToQueue(queueName, chunkRequestDTO) {
    // TODO: manage 2 queue (one for LOW and another for HIGH priority)
    if (!queue) {
        mainLogger.warn("No worker associated with the queue yet");
        return;
    }
    queue.push(chunkRequestDTO);
    mainLogger.debug(`Pushed to the queue: ${chunkRequestDTO.input_path}`);
}

module.exports = { addWorkerToQueue, pushToQueue };
