import path from "path";
import { STORAGE_DIR_PATH } from "../utils/const";

export default class ChunkRequestDTO {
    readonly input_path: string;
    readonly output_path: string;
    readonly remove_original: boolean;

    constructor(
        input_path: string,
        output_path: string,
        remove_original: boolean
    ) {
        this.input_path = input_path;
        this.output_path = output_path;
        this.remove_original = remove_original;
    }

    get videoId() {
        return path
            .relative(STORAGE_DIR_PATH, this.input_path)
            .split(path.sep)[0];
    }
}
