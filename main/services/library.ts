import path from "path";
import fs from "fs";

import AudioModel from "../model/audio";
import { getVideoById, getVideosTodo } from "../repository/video";
import VideoService from "./video";
import ChunkRequestDTO from "../dto/chunk-request";
import { get as getMainWindow } from "../windows/main-window";
import { pushToQueue, addWorkerToQueue } from "../lib/queue";
import { mainLogger } from "../utils/logger";
import { removeMusic } from "../lib/music-remover";
import { QueueName } from "../utils/enum";

export async function initQueue() {
    addWorkerToQueue(QueueName.LowPriorityAudioChunks, removeMusicFromChunk);
    const videos = await getVideosTodo();
    videos.forEach((video) => {
        video.audioChunksTodo.forEach((audio) => {
            const chunkRequest = new ChunkRequestDTO(
                audio.path,
                path.join(video.chunksDoneDir, path.basename(audio.path)),
                true
            );
            pushToQueue(QueueName.LowPriorityAudioChunks, chunkRequest);
        });
    });
}

export async function removeMusicFromChunk(chunkRequest: ChunkRequestDTO) {
    if (!fs.existsSync(chunkRequest.input_path)) {
        mainLogger.info(
            `Audio chunk already processed: ${chunkRequest.input_path}`
        );
        return;
    }
    const video = getVideoById(chunkRequest.videoId);

    if (video.metadata.isPending) {
        mainLogger.info(
            `Audio chunk skipped because is pending: ${chunkRequest.input_path}`
        );
        return;
    }
    try {
        mainLogger.info(`Call gRPC ${chunkRequest.input_path}`);
        const response = await removeMusic(chunkRequest);
        if (!response.getSucceeded()) {
            mainLogger.error(response.getError());
            return;
        }
        updateVideoInfo(chunkRequest.output_path);
    } catch (error) {
        mainLogger.error(error);
    }
}

export async function updateVideoInfo(audioChunkDonePath: string) {
    const audio = new AudioModel(audioChunkDonePath);
    const video = getVideoById(audio.videoId);
    const videoService = new VideoService(video);
    if (video.audioChunksTodo.length === 0) {
        await videoService.processChunksDone();
    }
    getMainWindow().webContents.send("video:updated", video.toDTO());
}
