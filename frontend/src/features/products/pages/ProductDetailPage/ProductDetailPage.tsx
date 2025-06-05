import {useParams} from "react-router";
import {useProduct} from "../../../../common/hooks/useProduct.ts";
import {OverlayLoading} from "../../../../common/components/ui/OverlayLoading/OverlayLoading.tsx";
import {ProductCard} from "./components/ProductCard/ProductCard.tsx";

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, isError, error } = useProduct(Number(id));


    if (isLoading) {
        return (
            <OverlayLoading message={'Cargando detalles del producto...'} />
        )
    }
    
    return (
        <>
            <ProductCard product={product} />
        </>
    )
}