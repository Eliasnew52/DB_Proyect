import {useCallback} from "react";
import {Controller, useForm} from "react-hook-form";
import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {Box, Button, FormHelperText, Grid, InputLabel, TextField, Typography} from "@mui/material";
import {Category} from "../../../types/categories.types.ts";
import FileUploadIcon from '@mui/icons-material/FileUpload';

export const CreateCategoryForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
        }
    });

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
            </Grid>
        </ContentContainer>
    )
}