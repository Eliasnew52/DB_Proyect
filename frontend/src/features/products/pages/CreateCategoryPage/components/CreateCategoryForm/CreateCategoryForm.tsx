import {useCallback, useState} from "react";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    TextField,
    Typography
} from "@mui/material";
import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import {AttributeBuilderModal} from "./components/AttributeBuilderModal/AttributeBuilderModal.tsx";
import {AttributePreview} from "./components/AttributePreview/AttributePreview.tsx";
import {useCreateCategory} from "../../../../hooks/category/useCreateCategory.ts";
import {useRouteNavigator} from "../../../../../../common/hooks/useRouteNavigator.ts";
import { RouteKey} from "../../../../../../common/router/routes.ts";
import {useNotifications} from "../../../../../../common/hooks/useNotifications.ts";
import {CategoryAttribute, CategoryFormValues} from "../../types/form.types.ts";
import {mapCreateCategoryFormToDTO} from "../../../../api/mappers/categoryMappers.ts";


export const CreateCategoryForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
    const [newType, setNewType] = useState("");
    const [newKey, setNewKey] = useState("");

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen])

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen])


    const methods = useForm<CategoryFormValues>({
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
            attributes: []
        },
    });

    const {
        handleSubmit,
        control,
    } = methods;

    const createCategory = useCreateCategory();

    const { go } = useRouteNavigator();

    const { showToast } = useNotifications();

    const onSubmit = useCallback((data: CategoryFormValues) => {

        const updatedData = {
            ...data,
            attributes: attributes,
        }

        const newCategory = mapCreateCategoryFormToDTO(updatedData)

        createCategory.mutate(
            newCategory,
            {
                onSuccess: () => {
                    showToast({
                        title: 'Categoría creada exitosamente.',
                        icon: 'success',
                    })
                    go(RouteKey.CATEGORY_LIST)
                },
                onError: error => {
                    showToast({
                        title: 'Error creando categoría',
                        text: error.message,
                        icon: 'error',
                    })
                }
            }
        )

    }, [attributes, go, showToast, createCategory])

    return (
        <FormProvider {...methods}>
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
                                    size={'small'}
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
                                    size={'small'}
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
                                <Grid container height={'220px'} justifyContent={'center'} alignItems={'center'} border={'2px dashed #ddd'} borderRadius={2}>

                                    <Button sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }} variant="text" component="label">
                                        <Grid>
                                            <FileUploadIcon />
                                        </Grid>
                                        <Grid>
                                            Seleccionar imagen
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                height={'100%'}
                                                width={'100%'}
                                                onChange={e =>
                                                    e.target.files?.[0] && field.onChange(e.target.files[0])
                                                }
                                            />
                                        </Grid>
                                        <Grid>
                                            {field.value && (
                                                <Typography variant="body2">
                                                    {(field.value as File).name}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Button>
                                </Grid>

                                {fieldState.error && (
                                    <FormHelperText error>
                                        {fieldState.error.message}
                                    </FormHelperText>
                                )}
                            </Box>
                        )}
                    />

                     <Grid>
                         <Button variant={"outlined"} startIcon={<SettingsIcon />} onClick={handleOpenModal}>
                             Atributos de producto
                         </Button>
                     </Grid>

                    <AttributeBuilderModal
                        open={isModalOpen}
                        handleClose={handleCloseModal}
                        attributes={attributes}
                        newKey={newKey}
                        newType={newType}
                        setNewKey={setNewKey}
                        setNewType={setNewType}
                        setAttributes={setAttributes}
                    />

                    {
                        attributes && attributes.length > 0 && (
                            <AttributePreview attributes={attributes} />
                        )
                    }


                    <Grid alignSelf={'end'}>
                        <Button type={'submit'} variant={'contained'} startIcon={<SaveIcon />} loading={createCategory.isPending}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </ContentContainer>
        </FormProvider>
    )
}