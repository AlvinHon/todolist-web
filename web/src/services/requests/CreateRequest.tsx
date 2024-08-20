class CreateRequest {
    name: string;
    description?: string;
    dueDate?: number;

    constructor(args: { name: string, description?: string, dueDate?: Date }) {
        this.name = args.name;
        this.description = args.description;
        this.dueDate = args.dueDate && Math.floor(args.dueDate.getTime() / 1000);
    }

}

export default CreateRequest;