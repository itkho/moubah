const fastq = require("fastq");
let queue;

function addWorkerToQueue(queueName, worker) {
    if (queue) {
        console.error("A worker is already associated with this queue");
        return;
    }
    queue = fastq.promise(worker, 1);
}

function pushToQueue(queueName, chunkRequestDTO) {
    // TODO: manage 2 queue (one for LOW and another for HIGH priority)
    if (!queue) {
        console.error("No worker associated with the queue yet");
        return;
    }
    queue.push(chunkRequestDTO);
}

module.exports = { addWorkerToQueue, pushToQueue }
