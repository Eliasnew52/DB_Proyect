import {NumericFormat} from "react-number-format";
import {Controller, FormProvider, useFieldArray, useForm} from "react-hook-form";
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import {
    Autocomplete, Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel, MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {SectionHeader} from "../../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import {SearchBar} from "./components/SearchBar/SearchBar.tsx";
import {CategoryFilter} from "./components/CategoryFilter/CategoryFilter.tsx";
import {ProductGrid} from "./components/ProductGrid/ProductGrid.tsx";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import {ShoppingCart} from "./components/ShoppingCart/ShoppingCart.tsx";
import {useState} from "react";
import {useCustomers} from "../../../../../../common/hooks/sales/useCustomers.ts";
import {usePaymentMethods} from "../../../../../../common/hooks/sales/usePaymentMethods.ts";
import {InlineLoading} from "../../../../../../common/components/ui/InlineLoading/InlineLoading.tsx";
import {useTransactionStatuses} from "../../../../../../common/hooks/useTransactionStatus.ts";
import {useDiscounts} from "../../../../../../common/hooks/sales/useDiscounts.ts";
import { useCartStore } from "../../../../store/useCartStore/useCartStore.ts";
import { useCreateSale } from "../../../../hooks/useCreateSale.ts";
import { useNotifications } from "../../../../../../common/hooks/useNotifications.ts";


export const CreateSaleForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState<number | null>(null);

    const methods = useForm();
    const { control, reset } = methods;

    const { isPending: isLoadingCustomers, isError: isLoadingCustomersError, data: customers , error: customerErrors } = useCustomers();
    const { isPending: isLoadingPaymentMethods, isError: isLoadingPaymentMethodsError, data: paymentMethods , error: paymentMethodsError } = usePaymentMethods();
    const { isPending: isLoadingTransactionStatuses, isError: isLoadingTransactionStatusesError, data: transactionStatuses , error: transactionStatusesError } = useTransactionStatuses();
    const { isPending: isLoadingDiscountTypes, isError: isLoadingDiscountTypesError, data: discountTypes, error: discountTypesError } = useDiscounts();

    const createSale = useCreateSale();
    const { showToast } = useNotifications();

    const discountTypeId = methods.watch('discount_type');
    const discountValue = Number(methods.watch('discount') || 0);
    const discountTypeObj = discountTypes?.find(dt => dt.id === discountTypeId);
    const discountType = discountTypeObj?.code === 'PERCENT' ? 'PERCENT' : 'FIXED';

    const subtotal = useCartStore(state => state.getSubtotal());
    const discount = useCartStore(state => state.getDiscount(discountValue, discountType));
    const total = useCartStore(state => state.getTotal(discountValue, discountType));

    const items = useCartStore(state => state.items);
    const clearCart = useCartStore(state => state.clearCart);

    const onSubmit = (data: any) => {
        const details = items.map(item => {
            if (data.discount_type && data.discount !== undefined && data.discount !== "") {
                return {
                    product: item.id,
                    quantity: item.quantity,
                    discount_type: data.discount_type,
                    discount_value: data.discount
                };
            }
            // Si hay descuento_id (descuento predefinido, no implementado aquí)
            // else if (data.discount_id) {
            //     return {
            //         product: item.id,
            //         quantity: item.quantity,
            //         discount_id: data.discount_id
            //     };
            // }
            // Sin descuento
            return {
                product: item.id,
                quantity: item.quantity
            };
        });

        const payload = {
            customer: data.customer,
            payment_method: data.payment_method,
            status: data.status,
            details
        };

        console.log(payload);

        createSale.mutate(payload, {
            onSuccess: () => {
                showToast({
                    title: 'Venta creada exitosamente',
                    icon: 'success'
                });
                reset();
                clearCart();
            },
            onError: (error) => {
                showToast({
                    title: 'Error creando venta',
                    text: error.message,
                    icon: 'error'
                });
            }
        });

    };

    return (
        <FormProvider {...methods}>
            <Grid
                container
                spacing={2}
                component={'form'}
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <ContentContainer
                    container
                    flexDirection={'column'}
                    size={7}
                    spacing={1}
                >
                    <SectionHeader
                        title="Crear nueva venta"
                        subtitle={'Gestiona tus ventas fácilmente'}
                    />
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    <CategoryFilter onClick={setCategory} />
                    <Grid
                        height={'calc(100vh - 230px)'}
                        sx={{
                            overflowY: 'auto',
                        }}
                    >
                        <ProductGrid search={searchTerm} category={category} />
                    </Grid>
                </ContentContainer>

                <ContentContainer
                    container
                    flexDirection={'column'}
                    size={5}
                >
                    <SectionHeader
                        title="Detalles de Venta"
                        Icon={AddShoppingCartOutlinedIcon}
                    />

                    <Grid
                        container
                        flexDirection={'column'}
                        spacing={2}
                    >
                        <Grid>
                            <InputLabel htmlFor={'customer'}>
                                Cliente *
                            </InputLabel>
                            <Controller
                                name={'customer'}
                                control={control}
                                defaultValue={null}
                                rules={{ required: 'El cliente es requerido.' }}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        {...field}
                                        disablePortal
                                        options={customers || []}
                                        loading={isLoadingCustomers}
                                        disabled={isLoadingCustomersError}
                                        isOptionEqualToValue={(opt, val) => opt.id === val?.id}
                                        getOptionLabel={(option) => option ? option.name : ''}
                                        onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}
                                        value={(customers || []).find(s => s.id === field.value) || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Elige un cliente"
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
                                            <MenuItem value=""><em>Elige un método de pago</em></MenuItem>
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
                                            <MenuItem value=""><em>Elige un estado</em></MenuItem>
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

                    <ShoppingCart />

                    <Grid >

                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid
                                size={5}
                            >
                                <InputLabel htmlFor={'discount_type'}>
                                    Tipo
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'discount_type'}
                                    defaultValue={''}
                                    rules={{
                                        validate: (value) => {
                                            const discount = methods.watch('discount');
                                            if ((discount !== undefined && discount !== "" && discount !== null) && !value) {
                                                return 'El tipo de descuento es requerido si se ingresa un descuento.';
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <FormControl error={fieldState.invalid} fullWidth>
                                            <Select
                                                {...field}
                                                id={'discount_type'}
                                                size={'small'}
                                                value={field.value}
                                                displayEmpty
                                            >
                                                <MenuItem value=""><em>Elige un tipo de descuento</em></MenuItem>
                                                {isLoadingDiscountTypes && !discountTypes?.length ? (
                                                    <InlineLoading message={'Cargando tipos de descuento'} />
                                                ) : (
                                                    discountTypes?.map(item => (
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
                            <Grid
                                size={7}
                            >
                                <InputLabel htmlFor={'discount_type'}>
                                    Descuento
                                </InputLabel>
                               <Controller
                                    control={control}
                                    name={'discount'}
                                    rules={{
                                        validate: value => {
                                            const discountTypeValue = methods.watch('discount_type');
                                            if (discountTypeValue && (value === undefined || value === "")) {
                                                return "El descuento es requerido si se selecciona un tipo.";
                                            }
                                            if (value !== undefined && value !== "" && value !== null) {
                                                const discount = Number(value);
                                                if (isNaN(discount) || discount < 0) {
                                                    return "El descuento es inválido.";
                                                }
                                                if (discountType === 'PERCENT' && discount > 100) {
                                                    return "El descuento porcentual no puede ser mayor a 100.";
                                                }
                                                if (discountType === 'FIXED' && discount > subtotal) {
                                                    return "El descuento no puede ser mayor al subtotal.";
                                                }
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={`Ingrese el descuento`}
                                            variant="outlined"
                                            fullWidth
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            allowNegative={false}
                                            decimalScale={2}
                                            isAllowed={({ floatValue }) =>
                                                floatValue === undefined ||
                                                (discountType === 'PERCENT'
                                                    ? floatValue >= 0 && floatValue <= 100
                                                    : floatValue >= 0 && floatValue <= subtotal)
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        flexDirection={'column'}
                        spacing={1}
                    >
                        <Grid
                            container
                            justifyContent={'space-between'}
                        >
                            <Typography>
                                Subtotal
                            </Typography>
                            <Typography>
                                {subtotal.toLocaleString('es-NI', {
                                    style: 'currency',
                                    currency: 'NIO',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            justifyContent={'space-between'}
                        >
                            <Typography color={'success'}>
                                Descuento
                            </Typography>
                            <Typography color={'success'}>
                                -{discount.toLocaleString('es-NI', {
                                    style: 'currency',
                                    currency: 'NIO',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            justifyContent={'space-between'}
                        >
                            <Typography
                                fontWeight={600}
                            >
                                Total
                            </Typography>
                            <Typography
                                fontWeight={600}
                            >
                                {total.toLocaleString('es-NI', {
                                    style: 'currency',
                                    currency: 'NIO',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justifyContent={'end'}
                    >
                        <Button
                            startIcon={<PriceCheckOutlinedIcon />}
                            variant={'contained'}
                            color={'success'}
                            type="submit"
                        >
                            Finalizar venta
                        </Button>
                    </Grid>
                </ContentContainer>
            </Grid>
        </FormProvider>
    )
}