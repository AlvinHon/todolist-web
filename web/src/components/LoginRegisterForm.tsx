import { useState } from "react";
import { Auth } from "../services/Api";
import { Box, Button, Chip, Divider, TextField } from "@mui/material";
import ExceptionResponse from "../services/responses/ExceptionResponse";
import { enqueueSnackbar } from "notistack";

export default function LoginRegisterForm(
    { onLogin }: { onLogin: (username: string) => void }
) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);

    const handleLogin = () => {
        setIsBtnDisabled(true)
        Auth.login(username, password)
            .then(() => {
                enqueueSnackbar("Login successful at " + new Date().toLocaleTimeString(), { variant: 'success' });
                onLogin(username);
            })
            .catch((exceptionResponse: ExceptionResponse) => {
                enqueueSnackbar("Fail to Login. Error: " + exceptionResponse.error, { variant: 'error' });
            })
            .finally(() => setIsBtnDisabled(false))
    }

    const handleRegister = () => {
        setIsBtnDisabled(true)
        Auth.register(username, password)
            .then(() => {
                enqueueSnackbar("Register successful at " + new Date().toLocaleTimeString(), { variant: 'success' });
                handleLogin();
            })
            .catch((exceptionResponse: ExceptionResponse) => {
                enqueueSnackbar("Fail to Register. Error: " + exceptionResponse.error, { variant: 'error' });
            })
            .finally(() => setIsBtnDisabled(false))
    }

    return (

        <Box sx={{ flexDirection: 'column', display: 'flex' }}>
            <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
            />
            <TextField
                margin="dense"
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
            />
            <Button
                variant="contained"
                type="submit"
                disabled={isBtnDisabled}
                onClick={handleLogin}
            >
                Login
            </Button>

            <Divider sx={{ mt: 2, mb: 2 }} >
                <Chip label="Or" size="small" />
            </Divider>

            <Button
                variant="contained"
                type="submit"
                disabled={isBtnDisabled}
                onClick={handleRegister}
            >
                Register
            </Button>
        </Box>
    )
}