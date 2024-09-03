import React, { useContext } from "react";
import { useCookies } from "react-cookie";

const AccountContext = React.createContext({
    username: "",
    loadFromCookie: () => { },
    setUsername: (username: string) => { },
});

export const useAccount = () => useContext(AccountContext);


export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = React.useState<string>("");
    const [cookie, setCookie, removeCookie] = useCookies(["username"]);

    const loadFromCookie = () => {
        setUsername(cookie.username ?? "");
    }

    const setUsernameWithCookie = (username: string) => {
        if (!username) {
            removeCookie("username");
            setUsername("");
            return;
        }

        setCookie("username", username);
        setUsername(username);
    }

    return (
        <AccountContext.Provider value={{ username, loadFromCookie, setUsername: setUsernameWithCookie }}>
            {children}
        </AccountContext.Provider>
    )
}
