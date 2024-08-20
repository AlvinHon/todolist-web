class DeleteResponse {
    id: String;

    constructor(args: { id: String }) {
        this.id = args.id;
    }
}

export default DeleteResponse;