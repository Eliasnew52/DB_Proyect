import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField, Typography, Box, Divider
} from "@mui/material";
import {ContentContainer} from "../../../../../common/components/ui/ContentContainer.tsx";
import {SectionHeader} from "../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {Controller, FormProvider, useForm} from "react-hook-form";
import {InlineLoading} from "../../../../../common/components/ui/InlineLoading/InlineLoading.tsx";
import {useProviders} from "../../../../../common/hooks/useProviders.ts";
import {useTransactionStatuses} from "../../../../../common/hooks/useTransactionStatus.ts";
import {usePaymentMethods} from "../../../../../common/hooks/usePaymentMethods.ts";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState, useCallback } from "react";
import { AddProductDialog } from "./components/AddProductDialog/AddProductDialog.tsx";
import {PurchaseProductItem} from "./components/PurchaseProductItem/PurchaseProductItem.tsx";

export const CreatePurchaseForm = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [localProducts, setLocalProducts] = useState([]);
    const methods = useForm();
    const { control, reset } = methods;

    const { data: suppliers, isLoading: isLoadingProviders, isError: isLoadingProvidersError, error: suppliersError } = useProviders();
    const { isPending: isLoadingTransactionStatuses, isError: isLoadingTransactionStatusesError, data: transactionStatuses , error: transactionStatusesError } = useTransactionStatuses();
    const { isPending: isLoadingPaymentMethods, isError: isLoadingPaymentMethodsError, data: paymentMethods , error: paymentMethodsError } = usePaymentMethods();
    
    const handleOpenDialog = useCallback(() => setOpenDialog(true), []);
    const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

    const addProduct = useCallback((product) => {
        setLocalProducts(prev => {
            const idx = prev.findIndex(p => p.id === product.id);
            if (idx !== -1) {
                const updated = [...prev];
                updated[idx].quantity += product.quantity;
                return updated;
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
    }, []);

    const removeProduct = useCallback((id) => {
        setLocalProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    const updateQuantity = useCallback((id, quantity) => {
        setLocalProducts(prev =>
            prev.map(p =>
                p.id === id ? { ...p, quantity: quantity > 0 ? quantity : 1 } : p
            )
        );
    }, []);

    // Calcula subtotal y total
    const subtotal = localProducts.reduce(
        (acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)),
        0
    );
    const total = subtotal; // Si hay descuentos o impuestos, ajusta aquí

    return (
        <FormProvider {...methods}>
            <Grid
                container
                spacing={2}
            >
                <ContentContainer
                    container
                    spacing={1}
                    width={'100%'}
                >
                    <SectionHeader
                        title={'Información de la compra'}
                        Icon={DescriptionOutlinedIcon}
                    />

                    <Grid
                        container
                        size={12}
                        spacing={2}
                    >
                        <Grid
                            container
                            flexDirection={'column'}
                            size={6}
                        >
                            <Grid
                                container
                                flexDirection={'column'}
                                spacing={2}
                                width={'100%'}
                            >
                                <Grid>
                                    <InputLabel htmlFor={'customer'}>
                                        Proveedor *
                                    </InputLabel>
                                    <Controller
                                        name={'supplier'}
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: 'El proveedor es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <Autocomplete
                                                {...field}
                                                disablePortal
                                                options={suppliers || []}
                                                loading={isLoadingProviders}
                                                disabled={isLoadingProvidersError}
                                                isOptionEqualToValue={(opt, val) => opt.id === val?.id}
                                                getOptionLabel={(option) => option ? option.name : ''}
                                                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}
                                                value={(suppliers || []).find(s => s.id === field.value) || null}
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
                                    <InputLabel htmlFor={'name'}>
                                        Número de factura *
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'invoice_number'}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                id={'invoice_number'}
                                                variant={'outlined'}
                                                size={'small'}
                                                fullWidth
                                                placeholder={'Ingrese el número de factura'}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'status'}>
                                        Estado de la venta *
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'status'}
                                        defaultValue={''}
                                        rules={{ required: 'El estado de la venta es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={fieldState.invalid} fullWidth>
                                                <Select
                                                    {...field}
                                                    id={'status'}
                                                    size={'small'}
                                                    fullWidth
                                                    value={field.value}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">Elige un estado</MenuItem>
                                                    {isLoadingTransactionStatuses && !transactionStatuses?.length ? (
                                                        <InlineLoading message={'Cargando estados...'} />
                                                    ) : (
                                                        transactionStatuses?.map(item => (
                                                            <MenuItem key={item.id} value={item.code}>{item.label}</MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                                {fieldState.error && (
                                                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid
                            container
                            flexDirection={'column'}
                            size={6}
                        >
                            <Grid
                                container
                                flexDirection={'column'}
                                spacing={2}
                            >
                                <Grid>
                                    <InputLabel htmlFor={'date'}>
                                        Fecha de compra *
                                    </InputLabel>
                                    <Controller
                                        name={'date'}
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: 'La fecha de compra es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                type={'date'}
                                                fullWidth
                                                size={'small'}
                                                placeholder={'Ingrese la fecha de compra'}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'invoice_image'}>
                                        Imagen de la factura
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'invoice_image'}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                type={'file'}
                                                id={'invoice_image'}
                                                variant={'outlined'}
                                                size={'small'}
                                                fullWidth
                                                placeholder={'Ingrese la imagen de la factura'}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid>
                                    <InputLabel htmlFor={'payment_method'}>
                                        Método de pago *
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name={'payment_method'}
                                        defaultValue={''}
                                        rules={{ required: 'El método de pago es requerido.' }}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={fieldState.invalid} fullWidth>
                                                <Select
                                                    {...field}
                                                    id={'payment_method'}
                                                    size={'small'}
                                                    fullWidth
                                                    value={field.value}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">Elige un método de pago</MenuItem>
                                                    {
                                                        isLoadingPaymentMethods && !paymentMethods?.length ? (
                                                            <InlineLoading message={'Cargando métodos de pago'} />
                                                        ) : (
                                                            paymentMethods?.map(item => (
                                                                <MenuItem key={item.code} value={item.code}>{ item.name }</MenuItem>
                                                            ))
                                                        )
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
                        </Grid>

                        <Grid
                            size={12}
                            width={'100%'}
                        >
                            <InputLabel htmlFor={'description'}>
                                Descripción del producto
                            </InputLabel>
                            <Controller
                                control={control}
                                name={'notes'}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="description"
                                        multiline
                                        placeholder={'Comentarios opcionales u observaciones...'}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </ContentContainer>

                <ContentContainer
                    width={'100%'}
                >

                    <Grid
                        container
                        justifyContent={'space-between'}
                    >
                        <SectionHeader
                            title={'Detalles de los productos'}
                            Icon={Inventory2OutlinedIcon}
                        />
                        <Button
                            variant={'contained'}
                            startIcon={<AddOutlinedIcon />}
                            onClick={handleOpenDialog}
                        >
                            Agregar producto
                        </Button>
                    </Grid>

                    <Grid
                        container
                        height={'calc(100vh - 650px)'}
                        sx={{
                            overflowY: 'auto',
                            gap: 1,
                        }}
                        width={'100%'}
                    >
                        {localProducts.map(item => (
                        <PurchaseProductItem
                            key={item.id}
                            item={item}
                            updateQuantity={updateQuantity}
                            removeItem={removeProduct}
                        />
                    ))}
                    </Grid>

                    

                    <AddProductDialog open={openDialog} handleClose={handleCloseDialog} addProduct={addProduct} />

                </ContentContainer>

                <ContentContainer width={'100%'}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22, mb: 1}}>
                    Resumen de compra
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Grid>
                        <Typography>Subtotal:</Typography>
                    </Grid>
                    <Grid>
                        <Typography sx={{ fontWeight: 500, background: "#e0e0e0", px: 1, borderRadius: 1 }}>
                            {subtotal.toLocaleString("es-NI", { style: "currency", currency: "NIO" })}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} />
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid>
                        <Typography sx={{ fontWeight: "bold" }}>Total:</Typography>
                    </Grid>
                    <Grid >
                        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
                            {total.toLocaleString("es-NI", { style: "currency", currency: "NIO" })}
                        </Typography>
                    </Grid>
                </Grid>
            </ContentContainer>
            </Grid>

            

        </FormProvider>
       
    )
}