import {useCallback, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {
    Button,
    Grid,
} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {Category} from "../../../../common/domain/products/categories.types.ts";
import SaveIcon from '@mui/icons-material/Save';
import {useCreateProduct} from "../../hooks/useCreateProduct.ts";
import {useRouteNavigator} from "../../../../common/hooks/useRouteNavigator.ts";
import {useNotifications} from "../../../../common/hooks/useNotifications.ts";
import {RouteKey} from "../../../../common/router/routes.ts";
import type {ProductFormValues} from "./types/form.types.ts";
import {ProductImageUpload} from "./components/ProductImageUpload.tsx";
import {ProductBasicInfoForm} from "./components/ProductBasicInfoForm.tsx";
import {ProductDetailsForm} from "./components/ProductDetailsForm/ProductDetailsForm.tsx";
import {ProductMeasurementsForm} from "./components/ProductMeasurementsForm.tsx";
import {mapCreateProductFormToDTO} from "../../api/mappers/products/productRequestMappers.ts";

export const CreateProductPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const methods = useForm<ProductFormValues>({
        shouldUnregister: true,
        defaultValues: {
            name: '',
            image: null,
            sale_price: '',
            purchase_price: '',
            category: null,
            brand: null,
            suppliers: [],
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
    const { handleSubmit } = methods;
    const { go } = useRouteNavigator();
    const { showToast } = useNotifications();
    
    const createProduct = useCreateProduct();

    const onSubmit = useCallback((data: ProductFormValues) => {

       const newProduct = mapCreateProductFormToDTO(data, selectedCategory)
        createProduct.mutate(newProduct, {
            onSuccess: () => {
                showToast({
                    title: 'Producto creado exitosamente',
                    icon: 'success'
                })
                
                go(RouteKey.PRODUCT_LIST);

            },
            onError: error => {
                showToast({
                    title: 'Error creando producto',
                    text: error.message,
                    icon: 'error',
                })
            }
        });

    }, [selectedCategory, createProduct, showToast, go])
    
    return (
        <FormProvider {...methods}>
            <Grid>
            <SectionHeader
                title="Crear un nuevo producto"
                subtitle='Añade un producto a tu catálogo de forma rápida y sencilla.'
            />

            <Grid container flexDirection={'column'} spacing={2} component={'form'} onSubmit={handleSubmit(onSubmit)}>

                <Grid container size={12}>
                    <ProductImageUpload />
                    <ProductBasicInfoForm setSelectedCategory={setSelectedCategory} />
                </Grid>

                <Grid size={12}>
                    <ProductDetailsForm selectedCategory={selectedCategory} />
                </Grid>

                <Grid size={12}>
                    <ProductMeasurementsForm />
                </Grid>

                <Grid container width={'100%'} justifyContent={'end'} alignItems={'center'}>
                    <Button loading={createProduct.isPending} type={'submit'} size={'large'} variant={'contained'} startIcon={<SaveIcon/>}>
                        Crear producto
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        </FormProvider>
    )
}