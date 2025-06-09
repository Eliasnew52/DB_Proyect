import {useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {SectionHeader} from "../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import AddIcon from "@mui/icons-material/Add";
import {LENGTH_UNITS, VOLUME_UNITS, WEIGHT_UNITS} from "../../../utils/constants/units.ts";

export const ProductMeasurementsForm = () => {
    const [showMeasurementsField, setShowMeasurementsField] = useState(false);
    const { control, watch } = useFormContext();

    const hasMeasurements = !!watch('length') || !!watch('height') || !!watch('width')
    const hasVolume = !!watch('volume')
    const hasWeight = !!watch('weight')

    return (
        <ContentContainer>
            <Grid container flexDirection={'column'} spacing={1}>
                <Grid container alignItems={'center'} justifyContent={'space-between'}>
                    <SectionHeader
                        title={'Mediciones y Especificaciones'}
                        subtitle={'Agregue medidas detalladas y especificaciones técnicas.'}
                    />

                    <Button
                        variant={'text'}
                        startIcon={<AddIcon />}
                        onClick={() => setShowMeasurementsField(!showMeasurementsField)}
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
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 2,
                            }}
                        >
                            <Grid>
                                <InputLabel htmlFor={'length'}>
                                    Longitud del producto
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'length'}
                                    rules={{
                                        required: {
                                            value: hasMeasurements,
                                            message: 'La longitud es requerida.'
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={'Ingrese la longitud del producto'}
                                            variant="outlined"
                                            fullWidth
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={fieldState.invalid}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid>
                                <InputLabel htmlFor={'width'}>
                                    Ancho del producto
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'width'}
                                    rules={{
                                        required: {
                                            value: hasMeasurements,
                                            message: 'El ancho es requerido.'
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={'Ingrese el ancho del producto'}
                                            variant="outlined"
                                            id={'width'}
                                            fullWidth
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={fieldState.invalid}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid>
                                <InputLabel htmlFor={'height'}>
                                    Altura del producto
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'height'}
                                    rules={{
                                        required: {
                                            value: hasMeasurements,
                                            message: 'La altura es requerida.'
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={'Ingrese la altura del producto'}
                                            variant="outlined"
                                            id={'height'}
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={fieldState.invalid}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid>
                                <InputLabel htmlFor={'length_unit'}>
                                    Unidad (L × A × H)
                                </InputLabel>
                                <Controller
                                    control={control}
                                    rules={{ required: { value: hasMeasurements, message: 'La unidad de medida es requerida.' } }}
                                    name={'length_unit'}
                                    render={({ field, fieldState }) => (
                                        <FormControl fullWidth error={fieldState.invalid}>
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
                                            <FormHelperText>{ fieldState.error ? fieldState.error.message : 'La unidad se aplica a Largo, Ancho y Altura.' }</FormHelperText>

                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid>
                                <InputLabel htmlFor={'weight'}>
                                    Peso del producto
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'weight'}
                                    rules={{
                                        required: {
                                            value: hasWeight,
                                            message: 'El peso es requerido.'
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={'Ingrese el peso del producto'}
                                            variant="outlined"
                                            id={'weight'}
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={fieldState.invalid}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid>
                                <InputLabel htmlFor={'weight_unit'}>
                                    Unidad del peso
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'weight_unit'}
                                    rules={{
                                        required: {
                                            value: hasWeight,
                                            message: 'La unidad de medida es requerida.'
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <FormControl fullWidth error={fieldState.invalid}>
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
                                            {
                                                fieldState.error && (

                                                    <FormHelperText>{ fieldState.error.message }</FormHelperText>
                                                )
                                            }
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid>
                                <InputLabel htmlFor={'volume'}>
                                    Volumen del producto
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'volume'}
                                    rules={{
                                        required: {
                                            value: hasVolume,
                                            message: 'El volumen es requerido'
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={'Ingrese el volumen del producto'}
                                            variant="outlined"
                                            id={'volume'}
                                            fullWidth
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                            error={fieldState.invalid}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid>
                                <InputLabel htmlFor={'volume'}>
                                    Unidad del volumen
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'volume_unit'}
                                    rules={{ required: { value: hasVolume, message: 'La unidad de medida es requerida.' } }}
                                    render={({ field, fieldState }) => (
                                        <FormControl fullWidth error={fieldState.invalid}>
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
                                            {
                                                fieldState.error && (
                                                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                                                )
                                            }
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                        </Grid>
                    )
                }
            </Grid>
        </ContentContainer>
    )
}