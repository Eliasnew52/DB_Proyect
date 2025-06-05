import React, {useCallback, useMemo, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {SectionHeader} from "../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {useBrands} from "../../../../../common/hooks/useBrands.ts";
import {useProviders} from "../../../../../common/hooks/useProviders.ts";
import {NumericFormat} from "react-number-format";
import {useCategories} from "../../../../../common/hooks/useCategories.ts";
import {Category} from "../../../../../common/types/categories.types.ts";
import {Supplier} from "../../../../../common/types/supplier.types.ts";

export const ProductDetailsForm = ({ selectedCategory }) => {
    const [openBrandAutocomplete, setOpenBrandAutocomplete] = useState(false);
    const [openProviderAutocomplete, setOpenProviderAutocomplete] = useState(false);
    const { control } = useFormContext();
    const { data: brands, isLoading: isLoadingBrands, isError: isLoadingBrandsError, error: brandsError } = useBrands(openBrandAutocomplete);
    const { data: suppliers, isLoading: isLoadingProviders, isError: isLoadingProvidersError, error: suppliersError } = useProviders(openProviderAutocomplete);
    const { data: categories, isError: isLoadingCategoriesError } = useCategories(true);

    const handleOpenBrandAutocomplete = useCallback(() => {
        setOpenBrandAutocomplete(true);
    }, [setOpenBrandAutocomplete])

    const handleCloseBrandAutocomplete = useCallback(() => {
        setOpenBrandAutocomplete(false);
    }, [setOpenBrandAutocomplete])

    const handleOpenProviderAutocomplete = useCallback(() => {
        setOpenProviderAutocomplete(true);
    },[setOpenProviderAutocomplete])

    const handleCloseProviderAutocomplete = useCallback(() => {
        setOpenProviderAutocomplete(false);
    }, [setOpenProviderAutocomplete])

    const currentCategoryProductSchema: Category | null = useMemo(() => {
        if (!categories || !selectedCategory || categories.length === 0) {
            return null;
        }
        return categories?.find(c => c.id === selectedCategory?.id) ?? null;
    }, [categories, selectedCategory])

    return (
        <ContentContainer>
            <Grid container flexDirection={'column'} spacing={1}>
                <SectionHeader
                    title={'Detalles del producto'}
                    subtitle={'Especificar información y especificaciones detalladas del producto'}
                    isRequired
                />

                <Grid
                    sx={{
                        display: 'grid',
                        width: '100%',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 2,
                    }}
                >
                    <Grid>
                        <InputLabel htmlFor={'brand'}>
                            Marca del producto *
                        </InputLabel>
                        <Controller
                            name={'brand'}
                            control={control}
                            defaultValue={null}
                            rules={{ required: 'La marca es requerida.' }}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    {...field}
                                    disablePortal
                                    open={openBrandAutocomplete}
                                    onOpen={handleOpenBrandAutocomplete}
                                    onClose={handleCloseBrandAutocomplete}
                                    options={brands || []}
                                    loading={isLoadingBrands}
                                    disabled={isLoadingBrandsError}
                                    getOptionLabel={opt => opt.name}
                                    getOptionKey={(option) => option.id}
                                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                    onChange={(_, newValue) =>
                                        field.onChange(newValue ? newValue.id : null)
                                    }
                                    value={
                                        brands?.find(b => b.id === field.value) ?? null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Elige una marca"
                                            size={"small"}
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={!!fieldState.error}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid>
                        <InputLabel htmlFor={'suppliers'}>
                            Proveedor del producto *
                        </InputLabel>
                        <Controller
                            name={'suppliers'}
                            control={control}
                            defaultValue={[]}
                            rules={{ required: 'El proveedor es requerido.' }}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    {...field}
                                    open={openProviderAutocomplete}
                                    onOpen={handleOpenProviderAutocomplete}
                                    onClose={handleCloseProviderAutocomplete}
                                    multiple
                                    disablePortal
                                    options={suppliers || []}
                                    loading={isLoadingProviders}
                                    disabled={isLoadingProvidersError}
                                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    onChange={(_, newValue) => field.onChange(newValue.map(o => o.id))}
                                    value={(suppliers || []).filter((s: Supplier) =>
                                        (field.value as number[]).includes(s.id)
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Elige un proveedor"
                                            size={"small"}
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={!!fieldState.error}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
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
                    {
                        currentCategoryProductSchema && (
                            Object.entries(currentCategoryProductSchema.product_schema.properties).map(([ key, value ], index) => (
                                <React.Fragment key={`${key}-${value.title}-${index}`}>
                                    {
                                        Object.prototype.hasOwnProperty.call(value, 'enum') ? (
                                            <Grid >
                                                <InputLabel htmlFor={key}>
                                                    {value.title} { currentCategoryProductSchema.product_schema.required.includes(key) ? "*" : '' }
                                                </InputLabel>
                                                <Controller
                                                    control={control}
                                                    name={key}
                                                    defaultValue={''}
                                                    rules={{
                                                        required: {
                                                            value: currentCategoryProductSchema.product_schema.required.includes(key),
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
            </Grid>
        </ContentContainer>
    )
}