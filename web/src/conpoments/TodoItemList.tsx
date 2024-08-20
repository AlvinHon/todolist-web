import { List, Paper, Typography } from "@mui/material";
import TodoItem from "../models/TodoItem";
import TodoItemListItemButton from "./TodoItemListItemButton";

export default function TodoItemList(
    { todoItems, selectTodoItem }: { todoItems: TodoItem[], selectTodoItem: (item: TodoItem) => void }
) {

    return (
        <>
            {
                todoItems.length === 0 ? (
                    <Typography data-testid="no-item-msg" variant="h6" component="div" align='center' sx={{ flexGrow: 1, pt: 5 }}>
                        No Todo Item 😊
                    </Typography>
                ) : (
                    <Paper data-testid="has-item-paper" style={{ maxHeight: "100%", overflow: 'auto' }}>
                        <List>
                            {todoItems.map((item: TodoItem) => (
                                <TodoItemListItemButton key={item.id} item={item} selectTodoItem={selectTodoItem} />
                            ))}
                        </List>
                    </Paper>
                )
            }
        </>
    )
}