import {Box, Button, FormHelperText, Grid, InputLabel, Typography} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {Controller, useForm} from "react-hook-form";
import {ContentContainer} from "../../../../common/components/ui/ContentContainer.tsx";

export const CreateProductPage = () => {
    const { control } = useForm()

    return (
        <Grid>
            <SectionHeader
                title="Crear un nuevo producto"
                subtitle='Añade un producto a tu catálogo de forma rápida y sencilla.'
            />

            <Grid container flexDirection={'column'} spacing={2}>

                <Grid container size={12}>
                    <ContentContainer size={{ md: 6, lg: 6, xl: 6 }} marginTop={0}>
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
                        <Grid container flexDirection={'column'}>
                            <Grid container spacing={2}>
                                <InfoOutlined />
                                Typography
                            </Grid>
                        </Grid>
                    </ContentContainer>
                </Grid>

                <Grid>

                </Grid>

            </Grid>
        </Grid>
    )
}