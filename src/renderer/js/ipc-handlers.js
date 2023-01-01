import { updateVideoInfo } from "./view/library.js";
import { updateMusicRemoverStatus } from "./view/search.js";

export default function initIpcHandlers() {
    window.videoAPI.handleVideoUpdatedEvent(async (_event, videoDTO) => {
        updateVideoInfo(videoDTO);
    });
    window.videoAPI.handleMusicRemoverStatusUpdatedEvent(
        async (_event, status) => {
            updateMusicRemoverStatus(status);
        }
    );
}
