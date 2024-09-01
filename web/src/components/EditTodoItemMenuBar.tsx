import { AppBar, Toolbar, Typography } from "@mui/material"
import TodoItem from "../models/TodoItem"
import ClickableIconButton from "./ClickableIconButton"
import { ArrowBack, Delete } from "@mui/icons-material"
import { useSnackbar } from "notistack"
import { API } from "../services/Api"


export default function EditTodoItemMenuBar(
    { editingItem, onClickBack }: {
        editingItem: TodoItem,
        onClickBack: () => void
    }
) {
    const { enqueueSnackbar } = useSnackbar();

    const onDelete = () => {
        API.delete({ id: editingItem.id })
            .then(() => {
                enqueueSnackbar("Deleted '" + editingItem.name + "' at " + new Date().toLocaleTimeString(), { variant: 'success' });
                onClickBack();
            });
    }

    return (
        <AppBar data-testid="menu-bar" position="static">
            <Toolbar>
                <ClickableIconButton onClickAction={onClickBack}>
                    <ArrowBack />
                </ClickableIconButton>
                <Typography variant="h5" component="p" sx={{ mr: 2 }} >
                    Edit
                </Typography>
                <Typography variant="h6" color="text.secondary" >
                    Item ID ({editingItem.id})
                </Typography>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />


                <ClickableIconButton onClickAction={onDelete}>
                    <Delete />
                </ClickableIconButton>
            </Toolbar>
        </AppBar >
    )
}