import { Box, Button, Grid, Input, Select, Stack, Typography } from "@mui/material";
import { Dispatch, FilterArgs } from "../types/Types";
import CloseableModal from "./CloseableModal";
import { useState } from "react";
import TodoItemStatus from "../models/TodoItemStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { validFilterArgsOrNull } from "../types/TypeConvertion";


export default function ShowPageModal(
    { open, setOpen, onSelectShowPage }: {
        open: boolean,
        setOpen: Dispatch<boolean>,
        onSelectShowPage: (page: number, limit: number, filterArgs: FilterArgs | null) => void
    }
) {
    const [pageNum, setPageNum] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filterStatus, setFilterStatus] = useState<TodoItemStatus | null>(null);
    const [filterDueDate, setFilterDueDate] = useState<Dayjs | null>(null);

    return (
        <>
            <CloseableModal open={open} setOpen={setOpen}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography id="child-modal-bodt" component="p">
                        Show Page
                    </Typography>
                    <Input
                        type="number"
                        defaultValue={pageNum}
                        onChange={(e) => {
                            if (e.target.value !== "") {
                                setPageNum(parseInt(e.target.value));
                            }
                        }} />
                    <Typography id="child-modal-bodt" component="p">
                        Limit
                    </Typography>
                    <Input
                        type="number"
                        defaultValue={limit}
                        onChange={(e) => {
                            if (e.target.value !== "") {
                                setLimit(parseInt(e.target.value));
                            }
                        }} />
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography id="child-modal-bodt" component="p">
                            Filter Status
                        </Typography>
                        <Grid item xs display='flex' justifyContent='end'>
                            <Select fullWidth native defaultValue={filterStatus} onChange={(e) => {
                                e.preventDefault();
                                setFilterStatus(e.target.value === "" ? null : e.target.value as TodoItemStatus);
                            }}>
                                <option ></option>
                                <option value={TodoItemStatus.NotStarted}>Not Started</option>
                                <option value={TodoItemStatus.InProgress}>In Progress</option>
                                <option value={TodoItemStatus.Completed}>Completed</option>
                            </Select>
                        </Grid>
                    </Stack>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography id="child-modal-bodt" component="p">
                            Filter Due Date
                        </Typography>
                        <Grid item xs display='flex' justifyContent='end'>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Due Date"
                                    value={filterDueDate}
                                    onChange={setFilterDueDate}
                                    sx={{ mb: 2, width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Stack>
                </Box>
                <Box sx={{ mt: 2, display: 'flex' }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 'auto' }} >
                        <Button onClick={() => {
                            setPageNum(0);
                            setLimit(10);
                            setFilterStatus(null);
                            setFilterDueDate(null);

                            setOpen(false);
                            onSelectShowPage(0, 10, null);
                        }}>
                            Reset
                        </Button>
                        <Button onClick={() => {
                            setOpen(false);

                            onSelectShowPage(pageNum, limit, validFilterArgsOrNull({
                                byStatus: filterStatus ? filterStatus : undefined,
                                byDueDate: filterDueDate ? filterDueDate.toDate() : undefined
                            }));
                        }}>
                            Apply
                        </Button>

                    </Stack>
                </Box>
            </CloseableModal>
        </>
    );
}