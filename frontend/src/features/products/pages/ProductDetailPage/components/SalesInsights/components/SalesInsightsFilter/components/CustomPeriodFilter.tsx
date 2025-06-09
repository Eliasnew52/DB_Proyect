import {Grid, TextField} from "@mui/material";
import {NumericFormat} from "react-number-format";
import {Controller, useFormContext} from "react-hook-form";

interface PeriodQuantityInputProps {
    label: string,
    name: string
}

export const CustomPeriodFilter = ({ label }: PeriodQuantityInputProps) => {
    const { control } = useFormContext();

    return (
        <Grid
            container
            spacing={1}
        >
            <Controller
                control={control}
                name={'to_date'}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        id={'to_date'}
                        variant={'outlined'}
                        size={'small'}
                        type={'date'}
                        label={'Desde'}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        helperText={fieldState.invalid ? fieldState.error?.message : ''}
                        error={fieldState.invalid}
                    />
                )}

            />
            <Controller
                control={control}
                name={'amount'}
                render={({ field, fieldState }) => (
                    <NumericFormat
                        {...field}
                        id={'amount'}
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