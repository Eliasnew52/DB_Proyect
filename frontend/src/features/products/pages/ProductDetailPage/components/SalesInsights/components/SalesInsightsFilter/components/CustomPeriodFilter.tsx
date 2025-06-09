import {Grid, TextField} from "@mui/material";
import {NumericFormat} from "react-number-format";
import {Controller, useFormContext} from "react-hook-form";

interface PeriodQuantityInputProps {
    label: string,
    name: string
}

export const CustomPeriodFilter = ({ label, name }: PeriodQuantityInputProps) => {
    const { control } = useFormContext();

    return (
        <Grid
            container
            spacing={1}
        >
            <Controller
                control={control}
                name={'from'}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        id={'startDate'}
                        variant={'outlined'}
                        size={'small'}
                        type={'date'}
                        label={'Desde'}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                    />
                )}

            />
            <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                    <NumericFormat
                        {...field}
                        id={name}
                        label={label}
                        customInput={TextField}
                        size={'small'}
                        decimalScale={0}
                        helperText={fieldState.invalid ? fieldState.error?.message : ''}
                        error={fieldState.invalid}
                    />
                )}

            />
        </Grid>
    )
}