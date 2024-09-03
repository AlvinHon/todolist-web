import { Box, Button, Divider, Typography } from "@mui/material";
import { Auth } from "../services/Api";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";


export default function Profile(
    { username, onLogout }: { username: string, onLogout: () => void }
) {
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    return (
        <Box sx={{ flexDirection: 'column', display: 'flex' }}>
            <Typography variant="h6">Logged in as {username}</Typography>
            <Divider sx={{ my: 2 }} />
            <Button
                variant="contained"
                onClick={() => {
                    setIsBtnDisabled(true);
                    Auth.logout()
                        .then(() => {
                            enqueueSnackbar("Logout Successfully", { variant: 'success' });
                            onLogout();
                        })
                        .catch(() => {
                            enqueueSnackbar("Fail to Logout", { variant: 'error' });
                        })
                        .finally(() => {
                            setIsBtnDisabled(false);
                        })
                }}
                disabled={isBtnDisabled}
            >
                Sign Out
            </Button>
        </Box>
    )
} 