import {useCallback, useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Box, Button, FormHelperText, Grid, InputLabel, TextField, Typography} from "@mui/material";
import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {Category} from "../../../types/categories.types.ts";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SettingsIcon from '@mui/icons-material/Settings';

export const CreateCategoryForm = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
            characteristics: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "characteristics",
    })

    const onSubmit = useCallback((data: Partial<Category>) => {

    }, [])

    return (
        <ContentContainer>
            <Grid
                component={'form'}
                container
                flexDirection="column"
                spacing={2}
                onSubmit={handleSubmit(onSubmit)}

            >
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'El nombre es obligatorio' }}
                    render={({ field, fieldState }) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <InputLabel htmlFor="name">Nombre</InputLabel>
                            <TextField
                                {...field}
                                id="name"
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                            />
                        </Box>
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <InputLabel htmlFor="description">Descripción</InputLabel>
                            <TextField
                                {...field}
                                id="description"
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </Box>
                    )}
                />

                <Controller
                    name="image"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <InputLabel htmlFor="image-upload">Imagen</InputLabel>
                            <Button variant="outlined" component="label" endIcon={<FileUploadIcon />}>
                                Seleccionar imagen
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={e =>
                                        e.target.files?.[0] && field.onChange(e.target.files[0])
                                    }
                                />
                            </Button>
                            {field.value && (
                                <Typography variant="body2">
                                    {(field.value as File).name}
                                </Typography>
                            )}
                            {fieldState.error && (
                                <FormHelperText error>
                                    {fieldState.error.message}
                                </FormHelperText>
                            )}
                        </Box>
                    )}
                />

                 <Grid>
                     <Button variant={"text"} startIcon={<SettingsIcon />} onClick={() => append({ key: '', title: '', type: 'string', options: [] })}>
                        Configura las características de los productos
                     </Button>
                 </Grid>

                {
                    fields.map((field, index) => (
                        <Grid
                            key={field.id}
                            container
                            flexDirection={'column'}
                        >
                            <Controller
                                name={`characteristics.${index}.key`}
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Nombre del campo" fullWidth />
                                )}
                            />
                        </Grid>
                    ))
                }

            </Grid>
        </ContentContainer>
    )
}