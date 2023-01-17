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
}
