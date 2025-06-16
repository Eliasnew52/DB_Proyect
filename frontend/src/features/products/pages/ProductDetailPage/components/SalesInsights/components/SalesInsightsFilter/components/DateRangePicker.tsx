import {Controller, useFormContext} from "react-hook-form";
import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {differenceInDays, differenceInWeeks, differenceInYears, isAfter, isBefore, isEqual} from "date-fns";

export const DateRangePicker = () => {
    const {control, watch} = useFormContext();

    const groupBy = watch('group_by');
    const fromDate = watch('from_date');
    const toDate = watch('to_date')

    return (
        <Grid
            container
            spacing={1}
        >
            <Controller
                control={control}
                name={'from_date'}
                rules={{
                    required: "La fecha de inicio es obligatoria",
                    validate: {
                        validDate: v =>
                            !v ||
                            !toDate ||
                            v <= fromDate ||
                            "La fecha inicial debe ser ≤ que la final."
                    }
                }}
                render={({field, fieldState}) => (
                    <TextField
                        {...field}
                        id={'from_date'}
                        type={'date'}
                        variant={'outlined'}
                        size={'small'}
                        label={'Fecha de inicio'}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        helperText={fieldState.error ? fieldState.error.message : ''}
                        error={fieldState.invalid}
                    />
                )}
            />

            <Controller
                control={control}
                name={'to_date'}
                rules={{
                    required: "La fecha de fin es obligatoria",
                    validate: {
                        validRange: (v: Date | null) =>
                            !fromDate ||
                            !v ||
                            v >= fromDate ||
                            "La fecha final debe ser ≥ que la inicial.",
                        validPeriod: (v: Date | null) => {
                            if (!fromDate || !v) return true;
                            const start = new Date(fromDate);
                            const end = new Date(v);
                            let diff = 0;
                            if (groupBy === "year") diff = differenceInYears(end, start) + 1;
                            else if (groupBy === "week") diff = differenceInWeeks(end, start) + 1;
                            else diff = differenceInDays(end, start) + 1;
                            return diff > 0 && diff <= 30 || "El rango supera el máximo permitido";
                        },
                    },
                }}
                render={({field, fieldState}) => (
                    <TextField
                        {...field}
                        id={'to_date'}
                        variant={'outlined'}
                        size={'small'}
                        type={'date'}
                        label={'Fecha final'}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        helperText={fieldState.error ? fieldState.error.message : ''}
                        error={fieldState.invalid}
                    />
                )}
            />

            <Controller
                name={'group_by'}
                control={control}
                defaultValue={'day'}
                rules={{
                    required: 'Este campo es requerido.'
                }}
                render={({field, fieldState}) => (
                    <FormControl
                        size={'small'}
                        variant="outlined"
                        error={fieldState.invalid}
                        sx={{
                            minWidth: 180
                        }}
                    >
                        <InputLabel id="group_by-label">Agrupar por</InputLabel>
                        <Select
                            {...field}
                            labelId="group_by-label"
                            id="group_by-select"
                            size={'small'}
                            label={'Agrupar por'}
                        >
                            <MenuItem
                                value={'day'}
                            >
                                Días
                            </MenuItem>
                            <MenuItem
                                value={'week'}
                            >
                                Semana
                            </MenuItem>
                            <MenuItem
                                value={'month'}
                            >
                                Mes
                            </MenuItem>
                        </Select>
                        {
                            fieldState.error && (
                                <FormHelperText>
                                    {fieldState.error.message}
                                </FormHelperText>
                            )
                        }
                    </FormControl>
                )}
            />
        </Grid>
    );
};