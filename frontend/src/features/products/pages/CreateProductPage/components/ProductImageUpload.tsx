import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {SectionHeader} from "../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {Controller, useFormContext} from "react-hook-form";
import {Box, Button, FormHelperText, Grid, Typography} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export const ProductImageUpload = () => {
    const { control } = useFormContext();

    return (
        <ContentContainer size={{ md: 6, lg: 6, xl: 6 }}>
            <SectionHeader
                title="Imagen del producto"
                subtitle='Carga una imagen de alta calidad de tu producto'
                isRequired
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
    )
}