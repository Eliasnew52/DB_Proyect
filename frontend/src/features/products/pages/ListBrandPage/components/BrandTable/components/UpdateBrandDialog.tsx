import {useCallback} from "react";
import {
    Button,
    Checkbox, CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField, Typography
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useUpdateBrand} from "../../../../../hooks/brands/useUpdateBrand.ts";
import {Brand} from "../../../../../../../common/domain/products/brands.types.ts";
import {useNotifications} from "../../../../../../../common/hooks/useNotifications.ts";

export const UpdateBrandDialog = ({ row, table }) => {

    const { formState: { isValid, isDirty }, reset, handleSubmit, control } = useForm({
        defaultValues: {
            name: row.original.name || '',
            description: row.original.description || '',
            image: undefined,
            active: row.original.active || '',
        }
    });

    const update = useUpdateBrand();
    const { showToast } = useNotifications();

    const onSubmit = useCallback((data: Partial<Brand>) => {
        update.mutate(
            {...row.original, ...data} as Brand,
            {
                onSuccess: response => {
                    reset();
                    table.setEditingRow(null);
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
    }, [reset, row.original, showToast, table, update])

    return (
        <>
            <DialogTitle variant="h3">Editar marca</DialogTitle>
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

                    <Grid
                        container
                        flexDirection={'column'}
                        alignItems="center"
                    >
                        <Typography fontSize={12}>
                            Vista previa de la imagen
                        </Typography>
                        <Grid maxHeight={70} maxWidth={70}>
                            <img src={row.original.image} alt={`${row.original.name} image`} height={'100%'} width={'100%'} />
                        </Grid>
                        <Grid alignSelf={'start'}>
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
                        </Grid>
                    </Grid>

                    <Controller
                        name="active"
                        control={control}
                        render={({field}) => (
                            <FormControlLabel
                                control={<Checkbox {...field} checked={field.value}/>}
                                label="Activo"
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => table.setEditingRow(null)} variant="outlined" color="error">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || !isDirty}
                        loading={update.isPending}
                    >
                        {update.isPending ? 'Guardando…' : 'Editar marca'}
                    </Button>
                </DialogActions>
            </form>
        </>
    )
}