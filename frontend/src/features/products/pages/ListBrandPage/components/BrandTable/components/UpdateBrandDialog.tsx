import {Button, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useForm} from "react-hook-form";

export const UpdateBrandDialog = ({ row, table }) => {

    const { register, formState: { isValid, isDirty } } = useForm({
        defaultValues: {
            name: row.original.name || '',
            description: row.original.description || '',
            image: row.original.image || '',
        }
    });



    return (
        <>
            <DialogTitle variant="h3">Editar marca</DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                <TextField label="Nombre de marca" variant="standard" {...register('name')} />
                <TextField label="Descripción" variant="standard" {...register('description')} />
                <TextField type={'file'} label="Imagen" variant="standard" {...register('image')} />
            </DialogContent>
            <DialogActions>
                <Grid  container justifyContent="flex-end" gap={2}>
                    <Button onClick={() => table.setEditingRow(null)} variant="outlined" color="error">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || !isDirty}>
                        Editar marca
                    </Button>
                </Grid>

            </DialogActions>
        </>
    )
}