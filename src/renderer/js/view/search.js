const style = getComputedStyle(document.body);
const videoCard = document.getElementById("video-card");
const arrows = document.getElementsByClassName("arrow");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const downloadButton = document.getElementById("download-button");
const arrowLeft = document.getElementsByClassName("fa-arrow-left")[0];
const arrowRight = document.getElementsByClassName("fa-arrow-right")[0];

let currentVideoIndex = 0;
let videos;

export function searchOnEnter(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
}

function displayVideo(video) {
    videoCard.innerHTML = `
        <div id="video-title">${video.title}</div>
        <img id="video-img" src=${video.thumbnail}>
    `;
}

export async function search() {
    videos = await window.videoAPI.getYoutubeResult(searchBar.value);
    displayVideo(videos[currentVideoIndex]);
    downloadButton.style.display = "flex";
    for (var arrow of arrows) {
        arrow.style.display = "flex";
    }
}

export async function downloadVideo() {
    let video = videos[currentVideoIndex];
    await window.videoAPI.sendToDownload(video.id);
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
