const VideoStatus = Object.freeze({
    initial: "initial",
    downloading: "downloading",
    processing: "processing",
    done: "done",
});

const MusicRemoverStatus = Object.freeze({
    up: "up",
    down: "down",
});

module.exports = {
    VideoStatus,
    MusicRemoverStatus,
};
