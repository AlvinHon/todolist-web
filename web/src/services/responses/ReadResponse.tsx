import TodoItem from "../../models/TodoItem";

class ReadResponse {
    items: TodoItem[];

    constructor(args: { items: TodoItem[] }) {
        this.items = args.items.map((item) => new TodoItem(item));
    }
}

export default ReadResponse;