import TodoItemStatus from "../models/TodoItemStatus";

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>;
interface CreationArgs { name: string, description?: string, dueDate?: Date };
interface UpdateArgs { id: string, name: string, description?: string, dueDate?: Date, status: TodoItemStatus }

type SortBy = "dueDate" | "status" | "name";
type SortDirection = "asc" | "desc";

interface SortByArgs { sortBy: SortBy; direction: SortDirection };
interface FilterArgs { byStatus?: TodoItemStatus, byDueDate?: Date };

export type { Dispatch, CreationArgs, SortByArgs, SortBy, SortDirection, FilterArgs, UpdateArgs };