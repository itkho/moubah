import { STORAGE_DIR_PATH, DIR_SEPARATOR, VIDEO_DIR_SEPARATOR } from "../utils/const";

export default class AudioModel {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    get videoId() {
        return this.path.split(STORAGE_DIR_PATH)[1].split(DIR_SEPARATOR)[1].split(VIDEO_DIR_SEPARATOR).slice(-1)[0];
    }
}
