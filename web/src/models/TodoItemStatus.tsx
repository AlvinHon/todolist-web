enum TodoItemStatus {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Completed = 'Completed'
}

namespace TodoItemStatus {
    export function fromString(input: string): TodoItemStatus | undefined {
        switch (input) {
            case "NotStarted":
                return TodoItemStatus.NotStarted;
            case "InProgress":
                return TodoItemStatus.InProgress;
            case "Completed":
                return TodoItemStatus.Completed;
            default:
                return undefined;
        }
    }

    export function toColor(status: TodoItemStatus): string {
        switch (status) {
            case TodoItemStatus.NotStarted:
                return "grey";
            case TodoItemStatus.InProgress:
                return "orange";
            case TodoItemStatus.Completed:
                return "green";
        }
    }
}

export default TodoItemStatus;