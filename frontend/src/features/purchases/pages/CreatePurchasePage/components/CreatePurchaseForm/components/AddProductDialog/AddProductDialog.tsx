import {forwardRef, useCallback, useEffect, useState} from "react";
import {
    Autocomplete,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    IconButton, InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
    Typography,
} from "@mui/material";
import {useForm, Controller, FormProvider} from "react-hook-form";
import {useInfiniteProducts} from "../../../../../../../common/hooks/products/useInfiniteProducts.ts";
import { NumericFormat } from "react-number-format";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AddProductDialog = ({ open, handleClose, addProduct  }) => {
    const [search, setSearch] = useState("");
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteProducts({ search, category: null });

    const methods = useForm({
        defaultValues: { product: null, quantity: 1 }
    });
    const { control, reset, getValues } = methods;

    const handleAdd = () => {
        const product = getValues("product");
        const quantity = Number(getValues("quantity")) || 1;
        if (product) {
            addProduct({ ...product, quantity });
            reset({ product: null, quantity: 1 });
            handleClose();
        }
    };

    useEffect(() => {
        if (!open) reset({ product: null, quantity: 1 });
    }, [open, reset]);

    return (
        <Dialog
            open={open}
            slots={{ transition: Transition }}
            keepMounted
            onClose={handleClose}
            scroll={"paper"}
            aria-describedby="alert-dialog-slide-description"

        >
            <DialogTitle>Añadir producto a la compra</DialogTitle>
            <DialogContent>
                <FormProvider {...methods}>
                    <Grid
                        container
                        flexDirection={'column'}
                        spacing={1}
                    >
                        <Grid>
                            <InputLabel htmlFor={'product'}>
                                Producto *
                            </InputLabel>
                            <Controller
                                name={'product'}
                                control={control}
                                rules={{ required: 'El producto es requerido.' }}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        {...field}
                                        options={data?.pages.flatMap(page => page.results) || []}
                                        loading={isLoading || isFetchingNextPage}
                                        getOptionLabel={option => option?.name || ''}
                                        filterOptions={x => x}
                                        onInputChange={(_, value) => setSearch(value)}
                                        onChange={(_, newValue) => field.onChange(newValue ? newValue : null)}
                                        value={field.value}
                                        slotProps={{
                                            listbox: {
                                                onScroll: (event) => {
                                                    const listboxNode = event.currentTarget;
                                                    if (
                                                        listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10 &&
                                                        hasNextPage &&
                                                        !isFetchingNextPage
                                                    ) {
                                                        fetchNextPage();
                                                    }
                                                },
                                                style: { maxHeight: 300, overflow: 'auto' }
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Elige un producto"
                                                size="small"
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                                error={!!fieldState.error}
                                                slotProps={{
                                                    input: {
                                                ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {(isLoading || isFetchingNextPage) ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                    }
                                                    
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid>
                            <InputLabel htmlFor={'quantity'}>
                                Cantidad *
                            </InputLabel>
                            <Controller
                                control={control}
                                name={'quantity'}
                                rules={{
                                    required: "La cantidad es requerida",
                                }}
                                render={({ field, fieldState }) => (
                                    <NumericFormat
                                        {...field}
                                        id={'quantity'}
                                        customInput={TextField}
                                        variant={'outlined'}
                                        allowNegative={false}
                                        decimalScale={0}
                                        size={'small'}
                                        fullWidth
                                        placeholder={'Ingrese la cantidad'}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </FormProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant={"outlined"}>
                    Cancelar
                </Button>
                <Button
                    variant={"contained"}
                    onClick={handleAdd}
                >
                    Agregar
                </Button>
            </DialogActions>
        </Dialog>
    )
}