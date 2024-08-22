import { Box, Divider, Modal, Typography } from "@mui/material";
import CreateTodoItemForm from "./CreateTodoItemForm";
import { Dispatch } from "../types/Types";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 370,
    maxWidth: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function CreateTodoItemModal(
    { open, setOpen, onCreated }: { open: boolean, setOpen: Dispatch<boolean>, onCreated: () => void }
) {
    return (
        <Modal
            open={open}
            onClose={() => { setOpen(false) }}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{ ...style }}>
                <Typography id="child-modal-title" variant="h6" component="h2">
                    Create a new task
                </Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <CreateTodoItemForm onCreated={() => {
                    setOpen(false);
                    onCreated();
                }} />
            </Box>
        </Modal>
    )
}