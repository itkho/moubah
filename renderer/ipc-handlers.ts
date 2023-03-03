import VideoDTO from "../main/dto/video.js";
import { updateMusicRemoverStatus } from "./components/Footer.js";
import { updateLocalVideo } from "./views/LibraryView.js";
import { showToastMessage } from "./views/MainView.js";

export default function initIpcHandlers() {
    window.videoApi.handleVideoUpdatedEvent(async (_event, video: VideoDTO) => {
        updateLocalVideo(video);
    });
    window.musicRemoverApi.handleStatusUpdatedEvent(async (_event, status) => {
        updateMusicRemoverStatus(status);
    });
    window.mainApi.handleNewToastMessage(
        async (_event, timestamp, type, text, link) => {
            showToastMessage(timestamp, type, text, link);
        }
    );
}
