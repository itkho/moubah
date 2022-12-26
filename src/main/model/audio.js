const { STORAGE_DIR_PATH } = require("../const");

class AudioModel {

    constructor(path) {
        this.path = path;
    }

    get videoId() {
        // TODO: adapt either it's win or mac
        return this.path.split(STORAGE_DIR_PATH)[1].split("/")[1];
    }
}

module.exports = AudioModel