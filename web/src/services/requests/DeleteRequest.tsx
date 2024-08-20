class DeleteRequest {
    id: string;

    constructor(args: { id: string }) {
        this.id = args.id;
    }

}

export default DeleteRequest;