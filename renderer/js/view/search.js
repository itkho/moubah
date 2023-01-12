import { abbrNum } from "../helpers.js";

const style = getComputedStyle(document.body);
const videoCard = document.getElementById("video-card");
const arrows = document.getElementsByClassName("arrow");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const downloadButton = document.getElementById("download-button");
const arrowLeft = document.getElementsByClassName("fa-arrow-left")[0];
const arrowRight = document.getElementsByClassName("fa-arrow-right")[0];
const musicRemoverStatus = document.getElementById("music-remover-status");

let currentVideoIndex = 0;
let videos;
let downloadedVideoIds;
window.videoAPI.getAll().then((videos) => {
    downloadedVideoIds = new Set(videos.map((video) => video.id));
});

export function searchOnEnter(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
}

function displayVideo(video) {
    videoCard.innerHTML = `
        <div>Title: ${video.title}</div>
        <div>Duration: ${video.timestamp} | Views: ${abbrNum(
        video.views,
        0
    )} views</div>
        <div>Author: ${video.author.name}</div>
        <img id="video-img" src=${video.thumbnail}>
    `;
    updateDownloadButton();
}

function updateDownloadButton() {
    const video = videos[currentVideoIndex];
    if (downloadedVideoIds.has(video.id)) {
        downloadButton.style.textDecoration = "line-through";
        downloadButton.style.pointerEvents = "none";
    } else {
        downloadButton.style.textDecoration = null;
        downloadButton.style.pointerEvents = null;
    }
}

export async function search() {
    videos = await window.videoAPI.getYoutubeResult(searchBar.value);
    const video = videos[currentVideoIndex];
    displayVideo(video);
    downloadButton.style.display = "flex";
    for (var arrow of arrows) {
        arrow.style.display = "flex";
    }
}

export function downloadVideo() {
    let video = videos[currentVideoIndex];
    window.videoAPI.sendToDownload(video.id);
    downloadedVideoIds.add(video.id);
    updateDownloadButton();
}

export function onClickArrowRight() {
    if (currentVideoIndex + 1 <= videos.length - 1) {
        currentVideoIndex++;
        arrowLeft.style.color = style.getPropertyValue("--gray-2-color");
        displayVideo(videos[currentVideoIndex]);
    }
    if (currentVideoIndex == videos.length - 1) {
        arrowRight.style.color = style.getPropertyValue("--gray-1-color");
    } else {
        arrowRight.style.color = style.getPropertyValue("--gray-2-color");
    }
}

export function onClickArrowLeft() {
    if (currentVideoIndex - 1 >= 0) {
        currentVideoIndex--;
        arrowRight.style.color = style.getPropertyValue("--gray-2-color");
        displayVideo(videos[currentVideoIndex]);
    }
    if (currentVideoIndex == 0) {
        arrowLeft.style.color = style.getPropertyValue("--gray-1-color");
    } else {
        arrowLeft.style.color = style.getPropertyValue("--gray-2-color");
    }
}

export async function updateMusicRemoverStatus(status) {
    switch (status) {
        case "up":
            musicRemoverStatus.style.color =
                style.getPropertyValue("--ok-color");
            break;
        case "down":
            musicRemoverStatus.style.color =
                style.getPropertyValue("--ko-color");
            break;
        default:
            throw `The status ${status} isn't recognized`;
    }
}
