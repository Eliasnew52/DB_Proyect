import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import {Checkbox, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Category} from "../../../../../../../common/domain/products/categories.types.ts";

export const ProductDynamicAttributes = ({ selectedCategory }: { selectedCategory: Category | null }) => {
    const { control } = useFormContext();

    return (
        <Grid
            sx={{
                display: 'grid',
                width: '100%',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 2,
            }}
        >
            {
                selectedCategory && (
                    Object.entries(selectedCategory.product_schema.properties).map(([ key, value ], index) => (
                        <React.Fragment key={`${key}-${value.title}-${index}`}>
                            {
                                Object.prototype.hasOwnProperty.call(value, 'enum') ? (
                                    <Grid >
                                        <InputLabel htmlFor={key}>
                                            {value.title} { selectedCategory.product_schema.required.includes(key) ? "*" : '' }
                                        </InputLabel>
                                        <Controller
                                            control={control}
                                            name={key}
                                            defaultValue={''}
                                            rules={{
                                                required: {
                                                    value: selectedCategory.product_schema.required.includes(key),
                                                    message: `${value.title} es requerido.`
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <FormControl error={fieldState.invalid} fullWidth>
                                                    <Select
                                                        {...field}
                                                        id={key}
                                                        size={'small'}
                                                        fullWidth
                                                        value={field.value}
                                                    >
                                                        {
                                                            value.enum.map(item => (
                                                                <MenuItem key={item} value={item}>{ item }</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                    {
                                                        fieldState.error && (
                                                            <FormHelperText>{fieldState.error.message}</FormHelperText>
                                                        )
                                                    }
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                ) : value.type === 'string' ? (
                                    <Grid>
                                        <InputLabel htmlFor={key}>
                                            {value.title}
                                        </InputLabel>
                                        <Controller
                                            name={key}
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    placeholder={`Ingrese el ${key} del producto`}
                                                    size={"small"}
                                                />
                                            )}
                                        />
                                    </Grid>
                                ) : value.type === 'boolean' ? (
                                    <Grid
                                        container
                                        flexDirection={'column'}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                    >
                                        <InputLabel htmlFor={key}>
                                            {value.title}
                                        </InputLabel>
                                        <Controller
                                            name={key}
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                    id={key}
                                                />
                                            )}
                                        />
                                    </Grid>
                                ) : value.type === 'number' ? (
                                    <Grid >
                                        <InputLabel htmlFor={key}>
                                            {key}
                                        </InputLabel>
                                        <Controller
                                            control={control}
                                            name={key}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(vals) => {
                                                        field.onChange(vals.floatValue)
                                                    }}
                                                    fullWidth
                                                    customInput={TextField}
                                                    size={'small'}
                                                    placeholder={`Ingrese el ${key} del producto`}
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </Grid>
                                ) : null
                            }
                        </React.Fragment>
                    ))
                )
            }
        </Grid>
    )
}