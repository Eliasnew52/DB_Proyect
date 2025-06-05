import {Controller, useFormContext} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import {Grid, InputLabel, TextField} from "@mui/material";

export const ProductStockAndPricingFields = () => {
    const { control } = useFormContext();

    return (
        <>
            <Grid>
                <InputLabel htmlFor={'sale_price'}>
                    Precio venta del producto *
                </InputLabel>
                <Controller
                    control={control}
                    rules={{ required: 'El precio de venta es requerido.' }}
                    name={'sale_price'}
                    render={({ field, fieldState }) => (
                        <NumericFormat
                            value={field.value}
                            fullWidth
                            customInput={TextField}
                            onValueChange={(vals) => {
                                field.onChange(vals.floatValue)
                            }}
                            thousandSeparator
                            prefix="$"
                            size={'small'}
                            placeholder={'Ingrese el precio venta del producto'}
                            variant="outlined"
                            helperText={fieldState.error ? fieldState.error.message : ''}
                            error={!!fieldState.error}
                        />
                    )}
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor={'purchase_price'}>
                    Precio compra del producto *
                </InputLabel>
                <Controller
                    control={control}
                    name={'purchase_price'}
                    rules={{ required: 'El precio de compra es requerido.' }}
                    render={({ field, fieldState }) => (
                        <NumericFormat
                            value={field.value}
                            fullWidth
                            customInput={TextField}
                            onValueChange={(vals) => {
                                field.onChange(vals.floatValue)
                            }}
                            thousandSeparator
                            prefix="$"
                            size={'small'}
                            placeholder={'Ingrese el precio compra del producto'}
                            variant="outlined"
                            helperText={fieldState.error ? fieldState.error.message : ''}
                            error={!!fieldState.error}
                        />
                    )}
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor={'purchase_price'}>
                    Stock del producto *
                </InputLabel>
                <Controller
                    control={control}
                    name={'stock'}
                    rules={{ required: 'El stock es requerido.' }}
                    render={({ field, fieldState }) => (
                        <NumericFormat
                            value={field.value}
                            fullWidth
                            customInput={TextField}
                            onValueChange={(vals) => {
                                field.onChange(vals.floatValue)
                            }}
                            size={'small'}
                            placeholder={'Ingrese el stock del producto'}
                            variant="outlined"
                            helperText={fieldState.error ? fieldState.error.message : ''}
                            error={!!fieldState.error}
                        />
                    )}
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor={'minimum_stock'}>
                    Stock mínimo del producto *
                </InputLabel>
                <Controller
                    control={control}
                    name={'minimum_stock'}
                    rules={{ required: 'El stock mínimo es requerido.' }}
                    render={({ field, fieldState }) => (
                        <NumericFormat
                            value={field.value}
                            fullWidth
                            customInput={TextField}
                            onValueChange={(vals) => {
                                field.onChange(vals.floatValue)
                            }}
                            size={'small'}
                            placeholder={'Ingrese el stock mínimo del producto'}
                            variant="outlined"
                            helperText={fieldState.error ? fieldState.error.message : ''}
                            error={!!fieldState.error}
                        />
                    )}
                />
            </Grid>
        </>
    )
}