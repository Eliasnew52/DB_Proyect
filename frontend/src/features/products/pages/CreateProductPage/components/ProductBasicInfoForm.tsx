import {Controller, useFormContext} from "react-hook-form";
import {SectionHeader} from "../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {Autocomplete, Button, CircularProgress, Grid, InputLabel, TextField} from "@mui/material";
import {useCallback, useState} from "react";
import {useCategories} from "../../../../../common/hooks/products/useCategories.ts";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";


export const ProductBasicInfoForm = ({ setSelectedCategory }) => {
    const [openAutocomplete, setOpenAutocomplete] = useState(false);
    const [showDescriptionField, setShowDescriptionField] = useState(false);
    const { control, register } = useFormContext();

    const { data: categories, isLoading: isLoadingCategories, isError: isLoadingCategoriesError, error: categoriesError } = useCategories(openAutocomplete);

    const handleOpenAutocomplete = useCallback(() => {
        setOpenAutocomplete(true);
    }, [])

    const handleCloseAutocomplete = useCallback(() => {
        setOpenAutocomplete(false);
    }, [])

    const handleToggleDescriptionField = useCallback(() => {
        setShowDescriptionField(!showDescriptionField);
    }, [showDescriptionField]);

    return (
        <ContentContainer size={{ md: 6, lg: 6, xl: 6 }} >
            <SectionHeader
                title="Información básica"
                Icon={InfoOutlineIcon}
                isRequired
            />
            <Grid>
                <InputLabel htmlFor={'name'}>
                    Nombre del producto *
                </InputLabel>
                <Controller
                    name={'name'}
                    rules={{
                        required: 'El nombre del producto es requerido.',
                    }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            id={'name'}
                            variant={'outlined'}
                            size={'small'}
                            fullWidth
                            placeholder={'Ingrese el nombre del producto'}
                            helperText={fieldState.error?.message ? fieldState.error?.message : ''}
                            error={fieldState.invalid}
                        />
                    )}
                />
            </Grid>
            <Grid>
                <InputLabel htmlFor={'category'}>
                    Categoría del producto *
                </InputLabel>
                <Controller
                    name={'category'}
                    control={control}
                    rules={{ required: 'La categoría es requerida.' }}
                    defaultValue={null}
                    render={({ field, fieldState }) => (
                        <Autocomplete
                            {...field}
                            open={openAutocomplete}
                            onOpen={handleOpenAutocomplete}
                            onClose={handleCloseAutocomplete}
                            disablePortal
                            disabled={isLoadingCategoriesError}
                            loading={isLoadingCategories}
                            options={categories || []}
                            getOptionKey={(option) => option.id}
                            getOptionLabel={(option) => option?.name}
                            onChange={(_, newValue) => {
                                field.onChange(newValue ? newValue.id : null);
                                setSelectedCategory(newValue);
                            }}
                            value={
                                categories?.find(c => c.id === field.value) ?? null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Elige una categoría"
                                    size={"small"}
                                    helperText={fieldState.error ? fieldState.error.message : ''}
                                    error={!!fieldState.error}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoadingCategories ? <CircularProgress size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid container flexDirection={'column'} spacing={1}>
                <Grid container alignItems={'center'} justifyContent={'space-between'}>
                    <InputLabel htmlFor={'description'}>
                        Descripción del producto
                    </InputLabel>
                    <Button
                        variant={'text'}
                        startIcon={<AddIcon />}
                        onClick={handleToggleDescriptionField}
                    >
                        { !showDescriptionField ? 'Añadir' : 'Ocultar' } descripción
                    </Button>
                </Grid>
                {
                    showDescriptionField && (
                        <TextField
                            id="description"
                            multiline
                            placeholder={'Ingresa un descripción detallada del producto'}
                            variant="outlined"
                            {...register('description')}
                        />
                    )
                }
            </Grid>
        </ContentContainer>

    )
}