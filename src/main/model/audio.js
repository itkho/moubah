const { STORAGE_DIR_PATH, DIR_SEPARATOR } = require("../const");

class AudioModel {

    constructor(path) {
        this.path = path;
    }

    get videoId() {
        return this.path.split(STORAGE_DIR_PATH)[1].split(DIR_SEPARATOR)[1];
    }
}

module.exports = AudioModel