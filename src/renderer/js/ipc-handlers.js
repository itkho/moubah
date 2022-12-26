import { updateVideoInfo } from './view/library.js';

export default function initIpcHandlers() {

    window.videoAPI.handleVideoUpdatedEvent(async (_event, videoDTO) => {
        updateVideoInfo(videoDTO);
    })

}
