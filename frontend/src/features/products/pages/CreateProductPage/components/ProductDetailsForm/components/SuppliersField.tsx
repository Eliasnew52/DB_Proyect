import {useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Autocomplete, Grid, InputLabel, TextField} from "@mui/material";
import type {Supplier} from "../../../../../../../common/domain/products/suppliers.types.ts";
import {useSuppliers} from "../../../../../../../common/hooks/products/useSuppliers.ts";

export const SuppliersField = () => {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext();
    const { data: suppliers, isLoading: isLoadingProviders, isError: isLoadingProvidersError, error: suppliersError } = useSuppliers(open);

    return (
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
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
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
    )
}