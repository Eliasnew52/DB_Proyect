import {Controller, useForm} from "react-hook-form";
import {
    Autocomplete,
    Box,
    Button, Checkbox,
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
import {useCallback, useEffect, useMemo, useState} from "react";
import {NumericFormat} from "react-number-format";
import {useCategories} from "../../hooks/useCategories.ts";
import {useBrands} from "../../hooks/useBrands.ts";
import {useProviders} from "../../hooks/useProviders.ts";
import {Category} from "../../../../common/types/categories.types.ts";
import SaveIcon from '@mui/icons-material/Save';
import {
    LENGTH_UNITS,
    VOLUME_UNITS,
    WEIGHT_UNITS
} from "../../constants/units.ts";

interface FormValues {
    name: string;
    image: File | null;
    sale_price: string;
    purchase_price: string;
    category: number | null;
    brand: number | null;
    suppliers: number[];

    description: string;
    minimum_stock: number | null;
    stock: number | null;

    length: string;
    length_unit: string;
    width: string;
    height: string;
    weight: string;
    weight_unit: string;
    volume: string;
    volume_unit: string;
};

const isFilled = (v: string) => v !== '' && v !== null && v !== undefined && v !== false;

const extractAttributes = (
    schemaKeys: string[],
    source: FormValues,
): Record<string, string> | undefined => {
    const attrs = Object.fromEntries(
        schemaKeys
            .filter(k => isFilled(source[k]))
            .map(k => [k, source[k]]),
    );
    return Object.keys(attrs).length ? attrs : undefined;
};

const MEASUREMENT_MAP = {
    length_unit : ['length', 'width', 'height'],
    volume_unit : ['volume'],
    weight_unit : ['weight'],
} as const;

type MeasurementPayload = Partial<Record<keyof typeof MEASUREMENT_MAP | (
    typeof MEASUREMENT_MAP[keyof typeof MEASUREMENT_MAP][number]
    ), string>>;

const extractMeasurements = (src: FormValues): MeasurementPayload | undefined => {
    const result: MeasurementPayload = {};

    (Object.keys(MEASUREMENT_MAP) as (keyof typeof MEASUREMENT_MAP)[])
        .forEach(unitKey => {
            if (!isFilled(src[unitKey])) return;
            result[unitKey] = src[unitKey];

            MEASUREMENT_MAP[unitKey].forEach(valKey => {
                result[valKey] = src[valKey] ?? '';
            });
        });

    return Object.keys(result).length ? result : undefined;
};

export const CreateProductPage = () => {
    const [showDescriptionField, setShowDescriptionField] = useState(false);
    const [showMeasurementsField, setShowMeasurementsField] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
        shouldUnregister: true,
        defaultValues: {
            name: '',
            image: null,
            sale_price: '',
            purchase_price: '',
            category: null,
            brand: null,
            suppliers: null,
            description: '',
            minimum_stock: null,
            stock: null,

            length: '',
            width: '',
            height: '',
            length_unit: '',
            weight: '',
            weight_unit: '',
            volume: '',
            volume_unit: '',
        }
    });

    const { data: categories, isLoading: isLoadingCategories, isError: isLoadingCategoriesError, error: categoriesError } = useCategories();
    const { data: brands, isLoading: isLoadingBrands, isError: isLoadingBrandsError, error: brandsError } = useBrands();
    const { data: suppliers, isLoading: isLoadingProviders, isError: isLoadingProvidersError, error: suppliersError } = useProviders();

    const handleToggleDescriptionField = useCallback(() => {
        setShowDescriptionField(!showDescriptionField);
    }, [showDescriptionField]);
    
    const handleToggleMeasurementsField = useCallback(() => {
        setShowMeasurementsField(!showMeasurementsField);
    }, [showMeasurementsField]);
    
    const currentCategoryProductSchema: Category | null = useMemo(() => {
        if (!categories || !selectedCategory || categories.length === 0) {
            return null;
        }
        return categories?.find(c => c.id === selectedCategory?.id) ?? null;
    }, [categories, selectedCategory])

    const onSubmit = useCallback((data: FormValues) => {
        const schemaKeys = Object.keys(
            currentCategoryProductSchema?.product_schema.properties || {},
        );
        const attributes = extractAttributes(schemaKeys, data);

        const measurements = extractMeasurements(data);

        const payload = Object.fromEntries(
            Object.entries({
                name           : data.name,
                description    : data.description,
                image          : data.image,
                sale_price     : data.sale_price,
                purchase_price : data.purchase_price,
                category       : data.category,
                suppliers      : data.suppliers,
                brand          : data.brand,
                stock          : data.stock,
                minimum_stock  : data.minimum_stock,
                attributes,
                measurements,
            }).filter(([, v]) => v !== undefined && v !== null),
        );

        console.log(payload);

    }, [currentCategoryProductSchema?.product_schema.properties])

    const hasMeasurements = !!watch('length') || !!watch('height') || !!watch('width')
    const hasSpecifications = !!watch('volume') || !!watch('weight') || !!watch('width')

    return (
        <Grid>
            <SectionHeader
                title="Crear un nuevo producto"
                subtitle='Añade un producto a tu catálogo de forma rápida y sencilla.'
            />

            <Grid container flexDirection={'column'} spacing={2} component={'form'} onSubmit={handleSubmit(onSubmit)}>

                <Grid container size={12}>
                    <ContentContainer size={{ md: 6, lg: 6, xl: 6 }}>
                        <SectionHeader
                            title="Imagen del producto *"
                            subtitle='Carga una imagen de alta calidad de tu producto'
                        />

                        <Controller
                            name={'image'}
                            control={control}
                            rules={{ required: 'La imagen es requerida.' }}
                            render={({ field, fieldState }) => (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Grid container height={'220px'} justifyContent={'center'} alignItems={'center'} border={`2px dashed ${fieldState.error ? '#D32F2F' : '#ddd'}`} borderRadius={2}>

                                        <Button sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }} variant="text" component="label">
                                            <Grid>
                                                <FileUploadIcon color={fieldState.error ? 'error' : 'primary'} />
                                            </Grid>
                                            <Grid>
                                                <Typography color={fieldState.error ? 'error' : 'primary'}>
                                                    Agregar imagen
                                                </Typography>
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

                    <ContentContainer size={{ md: 6, lg: 6, xl: 6 }} >
                        <SectionHeader
                            title="Información básica"
                            Icon={InfoOutlineIcon}
                        />
                        <Grid>
                            <InputLabel htmlFor={'name'}>
                                Nombre del producto *
                            </InputLabel>
                            <TextField
                                id={'name'}
                                variant={'outlined'}
                                size={'small'}
                                fullWidth
                                placeholder={'Ingrese el nombre del producto'}
                                {...register('name', {
                                    required: 'El nombre del producto es requerido.',
                                })}
                                helperText={errors?.name ? errors.name.message : ''}
                                error={!!errors?.name}
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
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                                error={!!fieldState.error}
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
                                        Marca del producto *
                                    </InputLabel>
                                    <Controller
                                        name={'brand'}
                                        control={control}
                                        rules={{ required: 'La marca es requerida.' }}
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
                                                        helperText={fieldState.error ? fieldState.error.message : ''}
                                                        error={!!fieldState.error}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'suppliers'}>
                                        Proveedor del producto *
                                    </InputLabel>
                                    <Controller
                                        name={'suppliers'}
                                        control={control}
                                        rules={{ required: 'El proveedor es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <Autocomplete
                                                {...field}
                                                // multiple
                                                // limitTags={4}
                                                disablePortal
                                                defaultValue={null}
                                                options={suppliers || []}
                                                loading={isLoadingProviders}
                                                disabled={isLoadingProvidersError}
                                                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                getOptionLabel={(option) => option ? option.name : ''}
                                                onChange={(_, newValue) => field.onChange(newValue)}
                                                value={field.value}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Elige un proveedor"
                                                        size={"small"}
                                                        helperText={fieldState.error ? fieldState.error.message : ''}
                                                        error={!!fieldState.error}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'sale_price'}>
                                        Precio venta del producto *
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        rules={{ required: 'El precio de venta es requerido.' }}
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
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                                error={!!fieldState.error}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'purchase_price'}>
                                        Precio compra del producto *
                                    </InputLabel>
                                    <Controller
                                      control={control}
                                      name={'purchase_price'}
                                      rules={{ required: 'El precio de compra es requerido.' }}
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
                                              helperText={fieldState.error ? fieldState.error.message : ''}
                                              error={!!fieldState.error}
                                          />
                                      )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'purchase_price'}>
                                        Stock del producto *
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'stock'}
                                        rules={{ required: 'El stock es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <NumericFormat
                                                {...field}
                                                fullWidth
                                                customInput={TextField}
                                                valueIsNumericString
                                                size={'small'}
                                                placeholder={'Ingrese el stock del producto'}
                                                variant="outlined"
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                                error={!!fieldState.error}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'minimum_stock'}>
                                        Stock mínimo del producto *
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'minimum_stock'}
                                        rules={{ required: 'El stock mínimo es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <NumericFormat
                                                {...field}
                                                fullWidth
                                                customInput={TextField}
                                                valueIsNumericString
                                                size={'small'}
                                                placeholder={'Ingrese el stock mínimo del producto'}
                                                variant="outlined"
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                                error={!!fieldState.error}
                                            />
                                        )}
                                    />
                                </Grid>
                                {
                                    currentCategoryProductSchema && (
                                        Object.entries(currentCategoryProductSchema.product_schema.properties).map(([ key, value ]) => (
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
                                                                defaultValue={''}
                                                                rules={{
                                                                    required: {
                                                                        value: currentCategoryProductSchema.product_schema.required.includes(key),
                                                                        message: `${value.title} es requerido.`
                                                                    }
                                                                }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        id={key}
                                                                        size={'small'}
                                                                        fullWidth
                                                                        value={field.value}
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
                                                    ) : value.type === 'string' ? (
                                                        <Grid key={key}>
                                                            <InputLabel htmlFor={key}>
                                                                {value.title}
                                                            </InputLabel>
                                                            <Controller
                                                                name={key}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <TextField
                                                                        {...field}
                                                                        placeholder={`Ingrese el ${key} del producto`}
                                                                        size={"small"}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    ) : value.type === 'boolean' ? (
                                                        <Grid key={key}
                                                            container
                                                            flexDirection={'column'}
                                                            alignItems={'center'}
                                                            justifyContent={'center'}
                                                        >
                                                            <InputLabel htmlFor={key}>
                                                                {value.title}
                                                            </InputLabel>
                                                            <Controller
                                                                name={key}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Checkbox
                                                                        {...field}
                                                                        id={key}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    ) : value.type === 'number' ? (
                                                        <Grid key={key}>
                                                            <InputLabel htmlFor={key}>
                                                                {key}
                                                            </InputLabel>
                                                            <Controller
                                                                control={control}
                                                                name={key}
                                                                render={({ field }) => (
                                                                    <NumericFormat
                                                                        {...field}
                                                                        fullWidth
                                                                        customInput={TextField}
                                                                        valueIsNumericString
                                                                        size={'small'}
                                                                        placeholder={`Ingrese el ${key} del producto`}
                                                                        variant="outlined"
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    ) : null
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
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                            gap: 2,
                                        }}
                                    >
                                        <Grid>
                                            <InputLabel htmlFor={'length'}>
                                                Longitud del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'length'}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese la longitud del producto'}
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid>
                                            <InputLabel htmlFor={'width'}>
                                                Ancho del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'width'}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese el ancho del producto'}
                                                            variant="outlined"
                                                            id={'width'}
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid>
                                            <InputLabel htmlFor={'height'}>
                                                Altura del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'height'}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese la altura del producto'}
                                                            variant="outlined"
                                                            id={'height'}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    control={control}
                                                    rules={{ required: { value: hasMeasurements, message: 'La unidad de medida es requerida.' } }}
                                                    name={'length_unit'}
                                                    render={({ field }) => (
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
                                            <InputLabel htmlFor={'weight'}>
                                                Peso del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'weight'}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese el peso del producto'}
                                                            variant="outlined"
                                                            id={'weight'}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    control={control}
                                                    name={'weight_unit'}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            size={'small'}
                                                        >
                                                            {
                                                                WEIGHT_UNITS.map(option => (
                                                                    <MenuItem key={option.key} value={option.key}>{ option.key }</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid>
                                            <InputLabel htmlFor={'volume'}>
                                                Volumen del producto
                                            </InputLabel>
                                            <Grid container spacing={1}>
                                                <Controller
                                                    control={control}
                                                    name={'volume'}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={TextField}
                                                            size={'small'}
                                                            placeholder={'Ingrese el volumen del producto'}
                                                            variant="outlined"
                                                            id={'volume'}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    control={control}
                                                    name={'volume_unit'}
                                                    rules={{ required: { value: hasSpecifications, message: 'La unidad de medida es requerida.' } }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            size={'small'}
                                                        >
                                                            {
                                                                VOLUME_UNITS.map(option => (
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
                    <Grid container width={'100%'} justifyContent={'end'} alignItems={'center'}>
                        <Button type={'submit'} size={'large'} variant={'contained'} startIcon={<SaveIcon/>}>
                            Crear producto
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}