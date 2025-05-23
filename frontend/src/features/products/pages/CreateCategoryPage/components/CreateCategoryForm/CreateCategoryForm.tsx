import {useCallback, useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {
    Autocomplete,
    Box,
    Button,
    FormHelperText,
    Grid, IconButton,
    InputLabel,
    MenuItem,
    Select, Switch,
    TextField,
    Typography
} from "@mui/material";
import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import {Category} from "../../../../types/categories.types.ts";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete'
import {AttributeBuilderModal} from "./components/AttributeBuilderModal.tsx";

export const CreateCategoryForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen])

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen])


    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
            characteristics: [{ key: '', title: '', type: '', options: [] }]
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
                     <Button variant={"text"} startIcon={<SettingsIcon />} onClick={handleOpenModal}>
                        Configura las características de los productos
                     </Button>
                 </Grid>

                <AttributeBuilderModal
                    fields={fields}
                    append={append}
                    remove={remove}
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    control={control}
                    watch={watch}
                />
            </Grid>
        </ContentContainer>
    )
}