import {NumericFormat} from "react-number-format";
import {Controller, FormProvider, useForm} from "react-hook-form";
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import {
    Autocomplete, Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {SectionHeader} from "../../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import {SearchBar} from "./components/SearchBar.tsx";
import {CategoryFilter} from "./components/CategoryFilter.tsx";
import {ProductGrid} from "./components/ProductGrid/ProductGrid.tsx";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import {ShoppingCart} from "./components/ShoppingCart/ShoppingCart.tsx";


export const CreateSaleForm = () => {
    const methods = useForm();
    const { control } = methods;

    return (
        <FormProvider {...methods}>
            <Grid
                container
                spacing={2}
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
                    <SearchBar />
                    <CategoryFilter />
                    <Grid
                        height={'calc(100vh - 230px)'}
                        sx={{
                            overflowY: 'auto',
                        }}
                    >
                        <ProductGrid />
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
                            <InputLabel htmlFor={'customers'}>
                                Cliente *
                            </InputLabel>
                            <Controller
                                name={'customers'}
                                control={control}
                                defaultValue={[]}
                                rules={{ required: 'El proveedor es requerido.' }}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        disablePortal
                                        options={[]}
                                        // loading={isLoadingProviders}
                                        // disabled={isLoadingProvidersError}
                                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                        getOptionLabel={(option) => option ? option.name : ''}
                                        onChange={(_, newValue) => field.onChange(newValue.map(o => o.id))}
                                        // value={(suppliers || []).filter(s =>
                                        //     (field.value as number[]).includes(s.id)
                                        // )}
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
                                rules={{
                                    // required: {
                                    //     value: currentCategoryProductSchema.product_schema.required.includes(key),
                                    //     message: `${value.title} es requerido.`
                                    // }
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl error={fieldState.invalid} fullWidth>
                                        <Select
                                            {...field}
                                            id={'payment_method'}
                                            size={'small'}
                                            fullWidth
                                            value={field.value}
                                        >
                                            {/*{*/}
                                            {/*    value.enum.map(item => (*/}
                                            {/*        <MenuItem key={item} value={item}>{ item }</MenuItem>*/}
                                            {/*    ))*/}
                                            {/*}*/}
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
                                rules={{
                                    // required: {
                                    //     value: currentCategoryProductSchema.product_schema.required.includes(key),
                                    //     message: `${value.title} es requerido.`
                                    // }
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl error={fieldState.invalid} fullWidth>
                                        <Select
                                            {...field}
                                            id={'status'}
                                            size={'small'}
                                            fullWidth
                                            value={field.value}
                                        >
                                            {/*{*/}
                                            {/*    value.enum.map(item => (*/}
                                            {/*        <MenuItem key={item} value={item}>{ item }</MenuItem>*/}
                                            {/*    ))*/}
                                            {/*}*/}
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

                    <ShoppingCart items={[]} />

                    <Grid >

                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid
                                size={2}
                            >
                                <InputLabel htmlFor={'discount_type'}>
                                    Tipo
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'discount_type'}
                                    defaultValue={''}
                                    // rules={{
                                    //     required: {
                                    //         value: currentCategoryProductSchema.product_schema.required.includes(key),
                                    //         message: `${value.title} es requerido.`
                                    //     }
                                    // }}
                                    render={({ field, fieldState }) => (
                                        <FormControl error={fieldState.invalid} fullWidth>
                                            <Select
                                                {...field}
                                                id={'discount_type'}
                                                size={'small'}
                                                value={field.value}
                                            >
                                                {/*{*/}
                                                {/*    value.enum.map(item => (*/}
                                                {/*        <MenuItem key={item} value={item}>{ item }</MenuItem>*/}
                                                {/*    ))*/}
                                                {/*}*/}
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
                            <Grid
                                size={10}
                            >
                                <InputLabel htmlFor={'discount_type'}>
                                    Descuento
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name={'discount'}
                                    render={({ field, fieldState }) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={TextField}
                                            size={'small'}
                                            placeholder={`Ingrese el descuento`}
                                            variant="outlined"
                                            fullWidth
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
                                C$310.00
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
                                -C$0.00
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
                                C$0.00
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
                        >
                            Finalizar venta
                        </Button>
                    </Grid>
                </ContentContainer>
            </Grid>
        </FormProvider>
    )
}