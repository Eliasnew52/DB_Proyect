import React from "react";
import {Button, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {TimePeriod} from "../utils/timePeriods.ts";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {NumericFormat} from "react-number-format";

export const SalesInsightsFilter = ({ timePeriods, timeFilter, setTimeFilter }: { timePeriods: TimePeriod[], timeFilter: TimePeriod, setTimeFilter: React.Dispatch<React.SetStateAction<string>> }) => {


    return (
        <Grid
            container
            flexDirection={'column'}
        >
            <Grid
                container
                flexDirection={'column'}
            >
                <InputLabel
                    htmlFor={'timeFilter'}
                >
                    Periodo de Tiempo
                </InputLabel>
                <Grid
                    container
                    spacing={2}
                >
                    <Select
                        id={'timeFilter'}
                        value={timeFilter}
                        size={'small'}
                        renderValue={(value: TimePeriod) => value.label}
                        onChange={(e) => {
                            setTimeFilter(e.target.value);
                        }}
                    >
                        {
                            timePeriods.map(({ value, label }) => (
                                <MenuItem
                                    key={value}
                                    value={value}
                                >
                                    { label }
                                </MenuItem>
                            ))
                        }
                    </Select>

                    {
                        timeFilter.inputType === 'number' && (
                            <Grid
                                container
                                flexDirection='column'
                                spacing={0}
                            >
                                <InputLabel>
                                    { timeFilter.label }
                                </InputLabel>
                                <NumericFormat
                                    size={'small'}

                                />
                            </Grid>
                        )
                    }

                    <Button
                        variant={'outlined'}
                        startIcon={<CalendarTodayIcon />}
                    >
                        Aplicar filtro
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}