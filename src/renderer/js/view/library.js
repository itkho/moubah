import Player from "./player.js";

const style = getComputedStyle(document.body);
const videoList = document.getElementById("video-list");

export async function displayLibrary() {
    videoList.replaceChildren();
    const videosDTO = await window.videoAPI.getAll();
    videosDTO.forEach((videoDTO) => {
        const videoItem = document.createElement("div");
        videoItem.className = "video-item";
        videoItem.style.display = "flex";
        videoItem.style.justifyContent = "space-between";
        videoItem.id = `video-id:${videoDTO.id}`;
        videoList.appendChild(videoItem);
        updateVideoInfo(videoDTO);
    });
}

function selectVideo(videoDTO) {
    const videosItem = document.getElementsByClassName("video-item");
    for (let videoItem of videosItem) {
        const videoText = videoItem.firstElementChild.lastElementChild;
        videoText.style.color = null;
        if (videoDTO.id === videoItem.id.replace("video-id:", "")) {
            videoText.style.color = style.getPropertyValue("--ok-color");
        }
    }
    Player.changeSource(videoDTO.videoUri, videoDTO.thumbnailUri);
}

export async function updateVideoInfo(videoDTO) {
    // TODO: handle the case where the video item isn't created yet
    const videoItem = document.getElementById(`video-id:${videoDTO.id}`);
    if (!videoItem) {
        return;
    }

    console.log(videoItem.hasChildNodes());
    if (videoItem.hasChildNodes()) {
        let progress = "";

        if (videoDTO.status !== "done") {
            progress = videoDTO.progress + "% | ";
        }

        const videoInfo = videoItem.getElementsByClassName("video-info")[0];
        if (videoDTO.status === "done") {
            videoInfo.onclick = () => {
                selectVideo(videoDTO);
            };
        }

        const videoText = videoInfo.getElementsByClassName("video-title")[0];
        console.log({ progress });
        console.log({ videoText });
        videoText.innerHTML = progress + videoDTO.title;
        // videoText.style.backgroundColor = "red";
        // videoItem.style.backgroundColor = "red";
    } else {
        const videoInfo = document.createElement("div");
        videoInfo.className = "video-info";
        videoInfo.style.display = "flex";

        const videoThumbnail = document.createElement("img");
        videoThumbnail.className = "video-img";
        videoThumbnail.src = videoDTO.thumbnailUri;
        videoInfo.appendChild(videoThumbnail);

        let progress = "";
        if (videoDTO.status !== "done") {
            progress = videoDTO.progress + "% | ";
        }

        const videoText = document.createElement("div");
        videoText.className = "video-title";
        videoText.innerHTML = progress + videoDTO.title;
        videoInfo.appendChild(videoText);

        if (videoDTO.status === "done") {
            videoInfo.onclick = () => {
                selectVideo(videoDTO);
            };
        }

        const deleteButton = document.createElement("i");
        deleteButton.className = "fa-solid fa-trash";
        deleteButton.onclick = () => {
            window.videoAPI.delete(videoDTO.id);
            videoItem.remove();
        };

        videoItem.appendChild(videoInfo);
        videoItem.appendChild(deleteButton);
    }
}
