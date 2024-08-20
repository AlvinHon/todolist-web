import TodoItemStatus from "./TodoItemStatus";

class TodoItem {
    id: string;
    name: string;
    description?: string;
    dueDate?: number;
    status: TodoItemStatus;

    constructor(args: { id: string, name: string, description?: string, dueDate?: number, status: TodoItemStatus }) {
        this.id = args.id!;
        this.name = args.name!;
        this.description = args.description?.valueOf();
        this.dueDate = args.dueDate?.valueOf();
        this.status = args.status!;
    }

    public getDueDate(): Date | undefined {
        if (this.dueDate === undefined) {
            return undefined;
        }
        return new Date(this.dueDate * 1000);
    }
}

export default TodoItem;