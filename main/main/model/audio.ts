import { STORAGE_DIR_PATH, DIR_SEPARATOR } from "../const";

export default class AudioModel {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    get videoId() {
        return this.path.split(STORAGE_DIR_PATH)[1].split(DIR_SEPARATOR)[1];
    }
}
