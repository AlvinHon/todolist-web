import { Box, Button, Select, Stack, Typography } from "@mui/material"
import { Dispatch, SortBy, SortByArgs, SortDirection } from "../types/Types"
import { useState } from "react";
import CloseableModal from "./CloseableModal";

export default function SortByModal(
    { open, setOpen, onSelectSortBy }: {
        open: boolean,
        setOpen: Dispatch<boolean>,
        onSelectSortBy: (sortBy: SortByArgs | null) => void
    }
) {
    const [sortBy, setSortBy] = useState<SortBy>("dueDate");
    const [direction, setDirection] = useState<SortDirection>("asc");

    return (
        <>
            <CloseableModal open={open} setOpen={setOpen}>
                <Stack direction="row" alignItems="center" spacing={2}>

                    <Typography id="child-modal-bodt" component="p">
                        Sort By
                    </Typography>
                    <Select native defaultValue={sortBy} onChange={(e) => {
                        e.preventDefault();
                        setSortBy(e.target.value as SortBy);
                    }}>
                        <option value="dueDate">Due Date</option>
                        <option value="status">Status</option>
                        <option value="name">Name</option>
                    </Select>
                    <Typography id="child-modal-bodt" component="p">
                        Direction
                    </Typography>
                    <Select native defaultValue={direction} onChange={(e) => {
                        setDirection(e.target.value as SortDirection);
                    }}>
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                    </Select>
                </Stack>
                <Box sx={{ mt: 2, display: 'flex' }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 'auto' }} >
                        <Button onClick={() => {
                            setSortBy("dueDate");
                            setDirection("asc");

                            setOpen(false);
                            onSelectSortBy(null);
                        }}>
                            Reset
                        </Button>
                        <Button onClick={() => {
                            setOpen(false);
                            onSelectSortBy({ sortBy, direction });
                        }}>
                            Apply
                        </Button>

                    </Stack>
                </Box>
            </CloseableModal>
        </>
    )
}