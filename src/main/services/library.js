const path = require("path");

const { AUDIO_CHUNK_QUEUE_LOW } = require("../const");
const AudioModel = require("../model/audio");
const VideoRepository = require("../repository/video");
const VideoService = require("./video");
const ChunkRequestDTO = require("../../dto/chunk-request");
const { getMainWindow } = require("../../main-window");
const { pushToQueue, addWorkerToQueue } = require("../queue");
const { removeMusic } = require("../lib/music-remover");

class LibraryService {
    static async initQueue() {
        addWorkerToQueue(AUDIO_CHUNK_QUEUE_LOW, LibraryService.removeMusic);
        const videos = await VideoRepository.getVideosTodo();
        videos.forEach((video) => {
            video.audioChunksTodo.forEach((audio) => {
                const chunkRequestDTO = new ChunkRequestDTO({
                    input_path: audio.path,
                    output_path: path.join(
                        video.chunksDoneDir,
                        path.basename(audio.path)
                    ),
                    remove_original: true,
                });
                pushToQueue(AUDIO_CHUNK_QUEUE_LOW, chunkRequestDTO);
            });
        });
    }

    static async removeMusic(chunkRequestDTO) {
        try {
            console.log(`Call gRPC ${chunkRequestDTO.input_path}`);
            const response = await removeMusic(chunkRequestDTO);
            if (!response.succeeded) {
                console.error(
                    `Error on ${chunkRequestDTO.input_path}:\n${response.error}`
                );
                return;
            }
            LibraryService.updateVideoInfo(chunkRequestDTO.output_path);
        } catch (error) {
            console.error(error);
        }
    }

    static async updateVideoInfo(audioChunkDonePath) {
        const audio = new AudioModel(audioChunkDonePath);
        const video = await VideoRepository.getVideoById(audio.videoId);
        const videoService = new VideoService(video);
        if (video.audioChunksTodo.length === 0) {
            videoService.processChunksDone();
        }
        getMainWindow().webContents.send("video:updated", video.toDTO());
    }
}

module.exports = LibraryService;
