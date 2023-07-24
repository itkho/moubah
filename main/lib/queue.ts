import fastq from "fastq";
import ChunkRequestDTO from "../dto/chunk-request";
import { QueueName } from "../utils/enum";
import { mainLogger } from "../utils/logger";

let queue: fastq.queue;

export function addWorkerToQueue(
    queueName: QueueName,
    worker: fastq.asyncWorker<unknown, ChunkRequestDTO>
) {
    if (queue) {
        mainLogger.warn("A worker is already associated with this queue");
        return;
    }
    queue = fastq.promise(worker, 1);
    mainLogger.debug(`Worker added to "${queueName}" queue`);
}

export function pushToQueue(
    queueName: QueueName,
    chunkRequestDTO: ChunkRequestDTO
) {
    // TODO: manage 2 queue (one for LOW and another for HIGH priority)
    // EDIT: no need with queue.unshift()
    if (!queue) {
        mainLogger.warn("No worker associated with the queue yet");
        return;
    }
    queue.push(chunkRequestDTO);
    mainLogger.debug(
        `Pushed to the queue "${queueName}": ${chunkRequestDTO.input_path}`
    );
}
