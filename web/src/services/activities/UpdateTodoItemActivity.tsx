import TodoItemStatus from "../../models/TodoItemStatus";

class UpdateTodoItemActivity {
    clientName: string;
    todoItemName: string;
    todoItemStatus: string


    constructor(args: { clientName: string, todoItemName: string, todoItemStatus: TodoItemStatus }) {
        this.clientName = args.clientName;
        this.todoItemName = args.todoItemName;
        this.todoItemStatus = args.todoItemStatus.toString();
    }

}

export default UpdateTodoItemActivity;