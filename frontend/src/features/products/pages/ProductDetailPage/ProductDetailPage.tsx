import {useParams} from "react-router";
import {useProduct} from "../../../../common/hooks/products/useProduct.ts";
import {OverlayLoading} from "../../../../common/components/ui/OverlayLoading/OverlayLoading.tsx";
import {ProductCard} from "./components/ProductCard/ProductCard.tsx";
import {SalesInsights} from "./components/SalesInsights/SalesInsights.tsx";
import {Grid} from "@mui/material";
import {StockMovementHistory} from "./components/StockMovementHistory/StockMovementHistory.tsx";
import {ActivityLog} from "./components/ActivityLog/ActivityLog.tsx";

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, isError, error } = useProduct(Number(id));


    if (isLoading) {

        return (
            <OverlayLoading message={'Cargando detalles del producto...'} />
        )
    }
    
    return (
        <Grid
            container
            justifyContent={'center'}
        >
            <Grid
                container
                flexDirection={'column'}
                spacing={3}
                maxWidth={'1200px'}
                width={'100%'}

            >
                <ProductCard product={product} />

                <SalesInsights productId={product?.id} />

                <StockMovementHistory />
                <ActivityLog />
            </Grid>

        </Grid>
    )
}