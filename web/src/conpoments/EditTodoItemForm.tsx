import { useEffect, useState } from "react";
import TodoItem from "../models/TodoItem";
import { validStringOrUndefined } from "../types/TypeConvertion";
import { UpdateArgs } from "../types/Types";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import TodoItemStatus from "../models/TodoItemStatus";
import { Circle } from "@mui/icons-material";
import { API, Feeds } from "../services/Api";
import UpdateRequest from "../services/requests/UpdateRequest";
import { useSnackbar } from "notistack";
import { useStompClient } from "react-stomp-hooks";
import { AppClientName } from "../App";
import ExceptionResponse from "../services/responses/ExceptionResponse";


export default function EditTodoItemForm(
    { editingItem }: { editingItem: TodoItem }
) {
    const { enqueueSnackbar } = useSnackbar();
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [todoStatus, setTodoStatus] = useState(TodoItemStatus.NotStarted);

    const stompClient = useStompClient();

    useEffect(() => {
        setName(editingItem.name);
        setDescription(editingItem.description ?? '');
        setDueDate(editingItem.dueDate ? dayjs(editingItem.getDueDate()) : null);
        setTodoStatus(editingItem.status);
    }, [editingItem]);

    const onApply = (args: UpdateArgs) => {
        setIsBtnDisabled(true);
        API.update(new UpdateRequest(args))
            .then(() => {
                enqueueSnackbar("Saved at " + new Date().toLocaleTimeString(), { variant: 'success' });
                stompClient?.publish(Feeds.Update.makeActivityMessage({ clientName: AppClientName, todoItemName: args.name, todoItemStatus: args.status }));
            })
            .catch((exceptionResponse: ExceptionResponse) => {
                enqueueSnackbar("Fail to update. Error: " + exceptionResponse.error, { variant: 'error' });
            })
            .finally(() => {
                setIsBtnDisabled(false)
            });
    }

    return (
        <Box sx={{ mt: 2 }}>
            <form onSubmit={(e) => {
                e.preventDefault();
                var desc = validStringOrUndefined(description);
                var date = dueDate?.toDate();

                let args = {
                    id: editingItem.id,
                    name,
                    description: desc,
                    dueDate: date,
                    status: todoStatus
                }
                onApply(args)
            }}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        sx={{ mb: 2, width: '100%' }}
                    />
                </LocalizationProvider>
                <FormControl sx={{ mb: 2, display: 'flex' }} >
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={todoStatus}
                        label="Status"
                        onChange={(e) => {
                            e.preventDefault();
                            setTodoStatus(TodoItemStatus.fromString(e.target.value) ?? TodoItemStatus.NotStarted)
                        }}>
                        <MenuItem value={TodoItemStatus.NotStarted}>
                            <Circle sx={{ mr: 2, color: TodoItemStatus.toColor(TodoItemStatus.NotStarted) }} />
                            Not Started
                        </MenuItem>
                        <MenuItem value={TodoItemStatus.InProgress}>
                            <Circle sx={{ mr: 2, color: TodoItemStatus.toColor(TodoItemStatus.InProgress) }} />
                            In Progress
                        </MenuItem>
                        <MenuItem value={TodoItemStatus.Completed}>
                            <Circle sx={{ mr: 2, color: TodoItemStatus.toColor(TodoItemStatus.Completed) }} />
                            Completed
                        </MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isBtnDisabled}
                >
                    Apply
                </Button>
            </form>
        </Box>
    )
}