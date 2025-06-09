import {useCallback} from "react";
import {
    Button,
    Checkbox, CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {Brand} from "../../../../../../../common/domain/products/brands.types.ts";
import {useNotifications} from "../../../../../../../common/hooks/useNotifications.ts";
import {useCreateBrand} from "../../../../../hooks/brands/useCreateBrand.ts";

export const CreateBrandDialog = ({ row, table }) => {

    const { formState: { isValid, isDirty }, reset, handleSubmit, control } = useForm({
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
        }
    });

    const update = useCreateBrand();
    const { showToast } = useNotifications();

    const onSubmit = useCallback((data: Partial<Brand>) => {
        update.mutate(
            data as Brand,
            {
                onSuccess: response => {
                    reset();
                    table.setCreatingRow(null);
                    showToast({
                        title: response.message,
                        icon: 'success',
                    })
                },
                onError: error => {
                    showToast({
                        title: error.message,
                        icon: 'error',
                    })
                }
            }
        );
    }, [reset, showToast, table, update])

    return (
        <>
            <DialogTitle variant="h3">Crear marca</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{required: 'El nombre es obligatorio'}}
                        render={({field, fieldState}) => (
                            <TextField
                                {...field}
                                label="Nombre"
                                variant="standard"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({field}) => (
                            <TextField {...field} label="Descripción" variant="standard" fullWidth/>
                        )}
                    />

                    <Controller
                        name="image"
                        control={control}
                        render={({field}) => (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => field.onChange(e.target.files?.[0])}
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions sx={{ marginTop: 1 }}>
                    <Button onClick={() => table.setCreatingRow(null)} variant="outlined" color="error">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || !isDirty}
                        loading={update.isPending}
                    >
                        {update.isPending ? 'Guardando…' : 'Crear marca'}
                    </Button>
                </DialogActions>
            </form>
        </>
    )
}