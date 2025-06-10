import React, {useCallback, useState} from "react";
import {Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {TimePeriod, timePeriods} from "../../utils/timePeriods.ts";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {Controller, FormProvider, useForm} from "react-hook-form";
import {DateRangePicker} from "./components/DateRangePicker.tsx";
import {mapProductSaleInsightsFormToDTO} from "../../../../../../api/mappers/products/productRequestMappers.ts";
import type {ProductSaleInsightsFormValues} from "../../types/form.types.ts";

export const SalesInsightsFilter = ({ productId, setFilters }: { productId: number, setFilters: React.Dispatch<React.SetStateAction<ProductSaleInsightsFormValues>>}) => {
    const [selectedValue, setSelectedValue] = useState<null | TimePeriod>(null)
    const methods = useForm<ProductSaleInsightsFormValues>({
        defaultValues: {
            product_id: undefined,
            amount: 0,
            from_date: '',
            to_date: '',
            period: timePeriods[2].value,
        },
        shouldUnregister: true,
    });
    
    const { control, handleSubmit } = methods;

    const onSubmit = useCallback((data: ProductSaleInsightsFormValues) => {
        const mappedData = mapProductSaleInsightsFormToDTO({
            ...data,
            product_id: productId
        })

        setFilters(mappedData);
    }, [productId, setFilters])

    return (
        <FormProvider {...methods}>
            <Grid
                container
                spacing={1}
                component={'form'}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid>
                    <Controller
                        name={'period'}
                        control={control}
                        defaultValue={timePeriods[0].value}
                        render={({ field, fieldState }) => (
                            <FormControl
                                size={'small'}
                                variant="outlined"
                                error={fieldState.invalid}
                                sx={{
                                    minWidth: 180
                                }}
                            >
                                <InputLabel id="period-label">Periodo de tiempo</InputLabel>
                                <Select
                                    {...field}
                                    labelId="period-label"
                                    id="period-select"
                                    size={'small'}
                                    label={'Periodo de tiempo'}
                                    onChange={(e, ) => {
                                        field.onChange(e.target.value);
                                        const timePeriod = timePeriods?.find(timePeriod => timePeriod.value === e.target.value);
                                        setSelectedValue(timePeriod || null)
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
                                    fieldState.error && (
                                        <FormHelperText>
                                            { fieldState.error.message }
                                        </FormHelperText>
                                    )
                                }
                            </FormControl>
                        )}
                    />


                </Grid>

                {
                    selectedValue?.inputType === 'date' && (
                        <DateRangePicker />
                    )
                }
                <Button
                    type={'submit'}
                    variant={'outlined'}
                    startIcon={<CalendarTodayIcon />}
                >
                    Aplicar filtro
                </Button>
            </Grid>


        </FormProvider>

    )
}