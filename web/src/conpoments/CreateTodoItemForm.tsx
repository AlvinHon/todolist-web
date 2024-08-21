import { Button, TextField } from "@mui/material";
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from "@mui/x-date-pickers";
import { validStringOrUndefined } from "../types/TypeConvertion";
import { CreationArgs } from "../types/Types";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useStompClient } from "react-stomp-hooks";
import { API, Feeds } from "../services/Api";
import { AppClientName } from "../App";
import CreateRequest from "../services/requests/CreateRequest";
import ExceptionResponse from "../services/responses/ExceptionResponse";

export default function CreateTodoItemForm(
    { onCreated }: { onCreated: () => void }
) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);

    const { enqueueSnackbar } = useSnackbar();
    const stompClient = useStompClient();


    const createTodoItem = (args: CreationArgs) => {
        API.create(new CreateRequest(args))
            .then(() => {
                enqueueSnackbar("Created '" + args.name + "' at " + new Date().toLocaleTimeString(), { variant: 'success' });
                stompClient?.publish(Feeds.Create.makeActivityMessage({ clientName: AppClientName, todoItemName: args.name }));
                onCreated()
            })
            .catch((exceptionResponse: ExceptionResponse) => {
                enqueueSnackbar("Fail to create. Error: " + exceptionResponse.error, { variant: 'error' });
            });
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            var desc = validStringOrUndefined(description);
            var date = dueDate?.toDate();
            createTodoItem({
                name,
                description: desc,
                dueDate: date
            });
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
            <Button
                type="submit"
                variant="contained"
                fullWidth
            >
                Create
            </Button>
        </form>
    )
}