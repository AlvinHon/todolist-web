import TodoItemStatus from "../../models/TodoItemStatus";

class FilterParams {
    byStatus?: TodoItemStatus;
    byDueDate?: number;

    constructor(args: { byStatus?: TodoItemStatus, byDueDate?: Date }) {
        this.byStatus = args.byStatus;
        this.byDueDate = args.byDueDate && Math.floor(args.byDueDate.getTime() / 1000);
    }
}

export default FilterParams;