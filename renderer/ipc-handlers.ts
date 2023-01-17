import VideoDTO from "../main/dto/video.js";
import { updateMusicRemoverStatus } from "./components/Footer.js";
import { updateLocalVideo } from "./views/LibraryView.js";

export default function initIpcHandlers() {
    window.videoApi.handleVideoUpdatedEvent(async (_event, video: VideoDTO) => {
        console.log({ video });
        updateLocalVideo(video);
    });
    window.musicRemoverApi.handleStatusUpdatedEvent(async (_event, status) => {
        updateMusicRemoverStatus(status);
    });
}
