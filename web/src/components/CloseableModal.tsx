import { ReactNode } from "react";
import { Dispatch } from "../types/Types";
import { Box, Modal } from "@mui/material";

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

export default function CloseableModal(
    { open, setOpen, children }: { open: boolean, setOpen: Dispatch<boolean>, children: ReactNode }
) {
    return (
        <>
            <Modal
                open={open}
                onClose={() => { setOpen(false) }}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }}>
                    {children}
                </Box>
            </Modal >
        </>
    );
}
