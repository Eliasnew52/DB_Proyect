import {useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Autocomplete, Grid, InputLabel, TextField} from "@mui/material";
import {useBrands} from "../../../../../../../common/hooks/products/useBrands.ts";

export const BrandField = () => {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext();
    const { data: brands, isLoading: isLoadingBrands, isError: isLoadingBrandsError, error: brandsError } = useBrands(open);

    return (
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
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
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
    )
}