class ChunkRequestDTO {
    constructor({ input_path, output_path, remove_original }) {
        this.input_path = input_path;
        this.output_path = output_path;
        this.remove_original = remove_original;
    }
}

module.exports = ChunkRequestDTO