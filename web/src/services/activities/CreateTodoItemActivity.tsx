class CreateTodoItemActivity {
    clientName: string;
    todoItemName: string;

    constructor(args: { clientName: string, todoItemName: string }) {
        this.clientName = args.clientName;
        this.todoItemName = args.todoItemName;
    }
}

export default CreateTodoItemActivity;