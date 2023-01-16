import VideoDTO from "../main/dto/video.js";
import { updateLocalVideo } from "./LibraryView.js";
// import { updateVideoInfo } from "./js/view/library.js";
// import { updateMusicRemoverStatus } from "./js/view/search.js";

export default function initIpcHandlers() {
    window.videoApi.handleVideoUpdatedEvent(async (_event, video: VideoDTO) => {
        console.log({ video });
        updateLocalVideo(video);
    });
    // window.musicRemoverAPI.handleStatusUpdatedEvent(async (_event, status) => {
    //     updateMusicRemoverStatus(status);
    // });
}
