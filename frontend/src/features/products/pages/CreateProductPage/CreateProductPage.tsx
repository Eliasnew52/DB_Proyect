import {Controller, useForm} from "react-hook-form";
import {
    Autocomplete,
    Box,
    Button,
    FormHelperText,
    Grid,
    InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {ContentContainer} from "../../../../common/components/ui/ContentContainer.tsx";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import AddIcon from '@mui/icons-material/Add';
import {useCallback, useMemo, useState} from "react";
import {NumericFormat} from "react-number-format";
import {useCategories} from "../../hooks/useCategories.ts";
import {useBrands} from "../../hooks/useBrands.ts";
import {useProviders} from "../../hooks/useProviders.ts";
import {Category} from "../../../../common/types/categories.types.ts";
import {LENGTH_UNITS, MEASUREMENT_NUMERIC_FIELDS, MEASUREMENT_UNIT_FIELDS} from "../../constants/units.ts";

export const CreateProductPage = () => {
    const [showDescriptionField, setShowDescriptionField] = useState(false);
    const [showMeasurementsField, setShowMeasurementsField] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { control, register } = useForm();
    const { data: categories, isLoading: isLoadingCategories, isError: isLoadingCategoriesError, error: categoriesError } = useCategories();
    const { data: brands, isLoading: isLoadingBrands, isError: isLoadingBrandsError, error: brandsError } = useBrands();
    const { data: suppliers, isLoading: isLoadingProviders, isError: isLoadingProvidersError, error: suppliersError } = useProviders();

    const handleToggleDescriptionField = useCallback(() => {
        setShowDescriptionField(!showDescriptionField);
    }, [showDescriptionField]);
    
    const handleToggleMeasurementsField = useCallback(() => {
        setShowMeasurementsField(!showMeasurementsField);
    }, [showMeasurementsField]);
    
    const currentCategoryProductSchema = useMemo(() => {
        if (!categories || !selectedCategory || categories.length === 0) {
            return null;
        }
        return categories?.find(c => c.id === selectedCategory?.id)?.product_schema;
    }, [categories, selectedCategory])

    return (
        <Grid>
            <SectionHeader
                title="Crear un nuevo producto"
                subtitle='Añade un producto a tu catálogo de forma rápida y sencilla.'
            />

            <Grid container flexDirection={'column'} spacing={2}>

                <Grid container size={12}>
                    <ContentContainer size={{ md: 6, lg: 6, xl: 6 }}>
                        <SectionHeader
                            title="Imagen del producto"
                            subtitle='Carga una imagen de alta calidad de tu producto'
                        />

                        <Controller
                            name={'image'}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Grid container height={'220px'} justifyContent={'center'} alignItems={'center'} border={'2px dashed #ddd'} borderRadius={2}>

                                        <Button sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }} variant="text" component="label">
                                            <Grid>
                                                <FileUploadIcon />
                                            </Grid>
                                            <Grid>
                                                Agregar imagen
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
                    </ContentContainer>

                    <ContentContainer size={{ md: 6, lg: 6, xl: 6 }}>
                        <SectionHeader
                            title="Información básica"
                            Icon={InfoOutlineIcon}
                        />
                        <Grid>
                            <InputLabel htmlFor={'name'}>
                                Nombre del producto
                            </InputLabel>
                            <TextField
                                id={'name'}
                                variant={'outlined'}
                                size={'small'}
                                fullWidth
                                placeholder={'Ingrese el nombre del producto'}
                                {...register('name')}
                            />
                        </Grid>
                        <Grid>
                            <InputLabel htmlFor={'category'}>
                                Categoría del producto
                            </InputLabel>
                            <Controller
                                name={'category'}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        {...field}
                                        disablePortal
                                        disabled={isLoadingCategoriesError}
                                        loading={isLoadingCategories}
                                        options={categories || []}
                                        getOptionKey={(option) => option.id}
                                        getOptionLabel={(option) => option?.name}
                                        onChange={(_, newValue) => {
                                            field.onChange(newValue);
                                            setSelectedCategory(newValue);
                                        }}
                                        value={field.value || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Elige una categoría"
                                                size={"small"}
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
                </Grid>

                <Grid container>
                    <ContentContainer size={12}>
                        <Grid container flexDirection={'column'} spacing={1}>
                            <SectionHeader
                                title={'Detalles del producto'}
                                subtitle={'Especificar información y especificaciones detalladas del producto'}
                            />

                            <Grid
                                sx={{
                                    display: 'grid',
                                    width: '100%',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: 2,
                                }}
                            >
                                <Grid>
                                    <InputLabel htmlFor={'brand'}>
                                        Marca del producto
                                    </InputLabel>
                                    <Controller
                                        name={'brand'}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Autocomplete
                                                {...field}
                                                disablePortal
                                                options={brands || []}
                                                loading={isLoadingBrands}
                                                disabled={isLoadingBrandsError}
                                                getOptionKey={(option) => option.id}
                                                getOptionLabel={(option) => option?.name}
                                                onChange={(_, newValue) => field.onChange(newValue)}
                                                value={field.value || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Elige una marca"
                                                        size={"small"}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'suppliers'}>
                                        Proveedor del producto
                                    </InputLabel>
                                    <Controller
                                        name={'suppliers'}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Autocomplete
                                                {...field}
                                                // multiple
                                                // limitTags={4}
                                                disablePortal
                                                options={suppliers || []}
                                                loading={isLoadingProviders}
                                                disabled={isLoadingProvidersError}
                                                getOptionKey={(option) => option.id}
                                                getOptionLabel={(option) => option?.name}
                                                onChange={(_, newValue) => field.onChange(newValue)}
                                                value={field.value || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Elige un proveedor"
                                                        size={"small"}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'sale_price'}>
                                        Precio venta del producto
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'sale_price'}
                                        render={({ field, fieldState }) => (
                                            <NumericFormat
                                                {...field}
                                                fullWidth
                                                customInput={TextField}
                                                thousandSeparator
                                                valueIsNumericString
                                                prefix="$"
                                                size={'small'}
                                                placeholder={'Ingrese el precio venta del producto'}
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'purchase_price'}>
                                        Precio compra del producto
                                    </InputLabel>
                                    <Controller
                                      control={control}
                                      name={'purchase_price'}
                                      render={({ field, fieldState }) => (
                                          <NumericFormat
                                              {...field}
                                              fullWidth
                                              customInput={TextField}
                                              thousandSeparator
                                              valueIsNumericString
                                              prefix="$"
                                              size={'small'}
                                              placeholder={'Ingrese el precio compra del producto'}
                                              variant="outlined"
                                          />
                                      )}
                                    />
                                </Grid>

                                {
                                    currentCategoryProductSchema && (
                                        Object.entries(currentCategoryProductSchema.properties).map(([ key, value ]) => (
                                            <>
                                                {
                                                    Object.prototype.hasOwnProperty.call(value, 'enum') ? (
                                                        <Grid key={key}>
                                                            <InputLabel htmlFor={key}>
                                                                {value.title}
                                                            </InputLabel>
                                                            <Controller
                                                                control={control}
                                                                name={key}
                                                                rules={{
                                                                    required: {
                                                                        value: currentCategoryProductSchema.required.includes(key),
                                                                        message: `${value.title} es requerido.`
                                                                    }
                                                                }}
                                                                render={({ field, fieldState }) => (
                                                                    <Select
                                                                        {...field}
                                                                        id={key}
                                                                        size={'small'}
                                                                        fullWidth
                                                                    >
                                                                        {
                                                                            value.enum.map(item => (
                                                                                <MenuItem key={item} value={item}>{ item }</MenuItem>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                                )}
                                                            />
                                                        </Grid>
                                                    ) : (<>no</>)
                                                }
                                            </>
                                        ))
                                    )
                                }
                            </Grid>
                        </Grid>

                    </ContentContainer>
                </Grid>

                <Grid container>
                    <ContentContainer size={12}>
                        <Grid container flexDirection={'column'} spacing={1}>
                            <Grid container alignItems={'center'} justifyContent={'space-between'}>
                                <SectionHeader
                                    title={'Mediciones y Especificaciones'}
                                    subtitle={'Agregue medidas detalladas y especificaciones técnicas.'}
                                />

                                <Button
                                    variant={'text'}
                                    startIcon={<AddIcon />}
                                    onClick={handleToggleMeasurementsField}
                                >
                                    { !showMeasurementsField ? 'Añadir' : 'Ocultar' } especificaciones
                                </Button>
                            </Grid>
                            {
                                showMeasurementsField && (
                                    <Grid
                                        sx={{
                                            display: 'grid',
                                            width: '100%',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: 2,
                                        }}
                                    >
                                        <Grid>
                                            <InputLabel htmlFor={'purchase_price'}>
                                                Longitud del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'length'}
                                                    render={({ field, fieldState }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese la longitud del producto'}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    control={control}
                                                    name={'length_unit'}
                                                    render={({ field, fieldState }) => (
                                                        <Select
                                                            {...field}
                                                            size={'small'}
                                                        >
                                                            {
                                                                LENGTH_UNITS.map(option => (
                                                                    <MenuItem key={option.key} value={option.key}>{ option.key }</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid>
                                            <InputLabel htmlFor={'purchase_price'}>
                                                Ancho del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'length'}
                                                    render={({ field, fieldState }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese la longitud del producto'}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    control={control}
                                                    name={'length_unit'}
                                                    render={({ field, fieldState }) => (
                                                        <Select
                                                            {...field}
                                                            size={'small'}
                                                        >
                                                            {
                                                                LENGTH_UNITS.map(option => (
                                                                    <MenuItem key={option.key} value={option.key}>{ option.key }</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                )
                            }
                        </Grid>

                    </ContentContainer>
                </Grid>
            </Grid>
        </Grid>
    )
}