import { AccountCircle, Add, Info, PageviewOutlined, Refresh, Sort } from "@mui/icons-material";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ReactComponent as Logo } from '../logo.svg';

import { useState } from "react";
import InfoModal from "./InfoModal";
import CreateTodoItemModal from "./CreateTodoItemModal";
import { FilterArgs, SortByArgs } from "../types/Types";
import SortByModal from "./SortByModal";
import ShowPageModal from "./ShowPageModal";
import ClickableIconButton from "./ClickableIconButton";
import AccountModal from "./AccountModal";
import { useAccount } from "../context/AccountContext";

export default function MenuBar(
    { onCreated, onSelectSortBy, onSelectShowPage, onClickRefresh }: {
        onCreated: () => void,
        onSelectSortBy: (sortBy: SortByArgs | null) => void
        onSelectShowPage: (page: number, limit: number, filterArgs: FilterArgs | null) => void
        onClickRefresh: () => void
    }
) {
    const { username } = useAccount();
    const [openInfo, setOpenInfo] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openSortBy, setOpenSortBy] = useState(false);
    const [openShowPage, setOpenShowPage] = useState(false);
    const [openAccount, setOpenAccount] = useState(false);

    return (
        <AppBar data-testid="menu-bar" position="static">
            <Toolbar>

                <ClickableIconButton onClickAction={() => setOpenAccount(true)}>
                    {(username) ? <Logo /> : <AccountCircle />}
                </ClickableIconButton>

                <Typography variant="h5" component="p" >
                    Todo List
                </Typography>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

                <ClickableIconButton onClickAction={() => setOpenShowPage(true)}>
                    <PageviewOutlined />
                </ClickableIconButton>

                <ClickableIconButton onClickAction={() => setOpenSortBy(true)}>
                    <Sort />
                </ClickableIconButton>

                <ClickableIconButton data-testid="refresh-btn" onClickAction={() => onClickRefresh()}>
                    <Refresh />
                </ClickableIconButton>

                <ClickableIconButton onClickAction={() => setOpenCreate(true)}>
                    <Add />
                </ClickableIconButton>

                <ClickableIconButton onClickAction={() => setOpenInfo(true)}>
                    <Info />
                </ClickableIconButton>
            </Toolbar>

            <AccountModal
                open={openAccount}
                setOpen={setOpenAccount}
            />

            <InfoModal
                open={openInfo}
                setOpen={setOpenInfo}
            />
            <CreateTodoItemModal
                open={openCreate}
                setOpen={setOpenCreate}
                onCreated={onCreated} />
            <SortByModal
                open={openSortBy}
                setOpen={setOpenSortBy}
                onSelectSortBy={onSelectSortBy}
            />
            <ShowPageModal
                open={openShowPage}
                setOpen={setOpenShowPage}
                onSelectShowPage={onSelectShowPage}
            />
        </AppBar>
    )
}