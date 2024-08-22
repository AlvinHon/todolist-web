import { CardContent, Divider, ListItemButton, Stack, Typography } from "@mui/material";
import TodoItem from "../models/TodoItem";
import { useEffect, useState } from "react";
import { Circle } from "@mui/icons-material";
import TodoItemStatus from "../models/TodoItemStatus";

export default function TodoItemListItemButton(
    { item, selectTodoItem }: { item: TodoItem, selectTodoItem: (item: TodoItem) => void }
) {
    const [statusColor, setStatusColor] = useState<string>('transparent');

    useEffect(() => {
        setStatusColor(TodoItemStatus.toColor(item.status) ?? 'transparent');
    }, [item.status]);

    return (
        <ListItemButton
            sx={{
                boxShadow: 24,
            }}
            onClick={() => {
                selectTodoItem(item);
            }}>
            <CardContent >
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                    <Circle sx={{ mr: 2, color: statusColor }} />
                    <Typography color="text.primary" variant="h5">
                        {item.name}
                    </Typography>
                </Stack>

                {item.getDueDate() && (
                    <Typography color="text.secondary" gutterBottom>
                        Due: {item.getDueDate()!.toLocaleString()}
                    </Typography>
                )}

                {item.description && (
                    <>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Typography color="text.secondary" component="pre">
                            {item.description}
                        </Typography>
                    </>
                )}
            </CardContent>
        </ListItemButton>
    )
}