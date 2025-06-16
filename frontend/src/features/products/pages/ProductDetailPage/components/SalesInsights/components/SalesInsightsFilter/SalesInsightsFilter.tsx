import React, {useCallback, useState} from "react";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import {TimePeriod, timePeriods} from "../../utils/timePeriods.ts";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {DateRangePicker} from "./components/DateRangePicker.tsx";
import {mapProductSaleInsightsFormToDTO} from "../../../../../../api/mappers/products/productRequestMappers.ts";
import type {ProductSaleInsightsFormValues} from "../../types/form.types.ts";

export const SalesInsightsFilter = ({ productId, setFilters }: { productId: number, setFilters: React.Dispatch<React.SetStateAction<ProductSaleInsightsFormValues>>}) => {
    const [selectedValue, setSelectedValue] = useState<null | TimePeriod>(null)
    const methods = useForm<ProductSaleInsightsFormValues>({
        defaultValues: {
            product_id: undefined,
            from_date: '',
            to_date: '',
            period: timePeriods[0].value,
            group_by: 'day',
        },
        shouldUnregister: true,
        mode: 'all'
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
            <Stack
                direction={'row'}
                alignItems="flex-start"
                spacing={1}
                component={'form'}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid>
                    <Controller
                        name={'period'}
                        control={control}
                        rules={{
                            required: 'El periodo es obligatorio.'
                        }}
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

            </Stack>
        </FormProvider>

    )
}