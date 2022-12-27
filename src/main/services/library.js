const path = require("path");

const { AUDIO_CHUNK_QUEUE_LOW, AUDIO_CHUNK_DONE_CHANNEL } = require("../const");
const AudioModel = require("../model/audio");
const VideoRepository = require("../repository/video");
const VideoService = require("./video");
const ChunkRequestDTO = require("../../dto/chunk-request");
const { getMainWindow } = require("../../main-window");
const { push } = require("../queue");


class LibraryService {

    static async initQueue() {
        const videos = await VideoRepository.getVideosTodo();
        videos.forEach(video => {
            video.audioChunksTodo.forEach(audio => {
                const chunkRequestDTO = new ChunkRequestDTO({
                    input_path: audio.path,
                    output_path: path.join(video.chunksDoneDir, path.basename(audio.path)),
                    remove_original: true
                });
                push(AUDIO_CHUNK_QUEUE_LOW, chunkRequestDTO);
            })
        });
    }

    static initSub() {
        // TODO: handle this on gRPC response
        // subscribeChannel(AUDIO_CHUNK_DONE_CHANNEL, LibraryService.updateVideoInfo);
    }

    static async updateVideoInfo(audioChunkDonePath, tmp) {
        const audio = new AudioModel(audioChunkDonePath);
        const video = await VideoRepository.getVideoById(audio.videoId);
        const videoService = new VideoService(video);
        if (video.audioChunksTodo.length === 0) {
            videoService.addAudioFromChunksDone();
        }
        getMainWindow().webContents.send("video:updated", video.toDTO())
    }
}

module.exports = LibraryService