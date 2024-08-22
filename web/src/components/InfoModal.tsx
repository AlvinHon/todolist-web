import { Divider, Typography } from "@mui/material";
import { ReactComponent as Logo } from '../logo.svg';
import { Dispatch } from "../types/Types";
import CloseableModal from "./CloseableModal";

export default function InfoModal({ open, setOpen }: { open: boolean, setOpen: Dispatch<boolean> }) {
    return (
        <>
            <CloseableModal open={open} setOpen={setOpen}>
                <Logo />
                <Typography id="child-modal-bodt" component="p">
                    This is a Todo List application, a simple application that allows you to manage your tasks.
                    It is built with React and Material-UI.
                </Typography>
                <br />
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Typography id="child-modal-bodt" color="text.secondary" variant="body2" component="div">
                    In details, the application allows you to:
                    <ul>
                        <li>Create a new task</li>
                        <li>Read all tasks</li>
                        <li>Update a task</li>
                        <li>Delete a task</li>
                    </ul>
                </Typography>
            </CloseableModal>
        </>
    )
}