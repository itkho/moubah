import Player from "./player.js";

const videoList = document.getElementById('video-list');


export async function displayLibrary() {
    videoList.replaceChildren();
    const videosDTO = await window.videoAPI.getAll();
    videosDTO.forEach(videoDTO => {
        const videoItem = document.createElement("div");
        videoItem.style.display = "flex";
        videoItem.id = `video-id:${videoDTO.id}`;
        videoList.appendChild(videoItem);
        updateVideoInfo(videoDTO);
    });
}


export async function updateVideoInfo(videoDTO) {
    // TODO: handle the case where the video item isn't created yet
    const videoItem = document.getElementById(`video-id:${videoDTO.id}`);

    let progress = "";
    if (videoDTO.status === "done") {
        videoItem.onclick = () => {
            Player.changeSource(
                videoDTO.videoUri,
                videoDTO.thumbnailUri,
            );
        };
    } else {
        progress = videoDTO.progress + "% | ";
    }

    videoItem.innerHTML = `
        <img class="video-img" src="${videoDTO.thumbnailUri}">
        <div class="video-title">${progress + videoDTO.title}</div>
    `;
}