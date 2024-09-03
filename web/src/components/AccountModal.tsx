import { useAccount } from "../context/AccountContext";
import { Dispatch } from "../types/Types";
import CloseableModal from "./CloseableModal";
import LoginRegisterForm from "./LoginRegisterForm";
import Profile from "./Profile";

export default function AccountModal({ open, setOpen }: { open: boolean, setOpen: Dispatch<boolean> }) {
    const { username, setUsername } = useAccount();
    return (
        <CloseableModal open={open} setOpen={setOpen}>
            {username ? (
                <Profile username={username} onLogout={() => {
                    setUsername("");
                    setOpen(false);
                }} />
            ) : (
                <LoginRegisterForm
                    onLogin={(username) => {
                        setUsername(username);
                        setOpen(false);
                    }}
                />
            )}
        </CloseableModal>
    )
}

