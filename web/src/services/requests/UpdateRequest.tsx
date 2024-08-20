import TodoItemStatus from "../../models/TodoItemStatus";

class UpdateRequest {
    id: string;
    name: string;
    description?: string;
    dueDate?: number;
    status: string;

    constructor(args: { id: string, name: string, description?: string, dueDate?: Date, status: TodoItemStatus }) {
        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.dueDate = args.dueDate && Math.floor(args.dueDate.getTime() / 1000);
        this.status = args.status.toString();
    }

}

export default UpdateRequest;