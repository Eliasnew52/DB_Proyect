import {ProductImage} from "./components/ProductImage.tsx";
import {Grid} from "@mui/material";
import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import {ProductHeader} from "./components/ProductHeader.tsx";
import {ProductInfoGrid} from "./components/ProductInfoGrid/ProductInfoGrid.tsx";
import {ProductTabs} from "./components/ProductTabs/ProductTabs.tsx";
import {Product} from "../../../../../../common/types/products.types.ts";
import {useMemo} from "react";

export const ProductCard = ({ product }: { product?: Product }) => {
    const needsRestock = useMemo(() => (product && product?.stock < product?.minimum_stock) ?? false, [product]);

    return (
        <Grid
            container
            spacing={2}
        >
            <ProductImage
                image={product?.image}
                alt={product?.name}
            />

            <Grid
                size={8}
                container
                flexDirection={'column'}
                spacing={2}
            >
                <ContentContainer
                    container
                    flexDirection={'column'}
                    spacing={2}
                >

                    <ProductHeader
                        active={product?.active}
                        brandName={product?.brand.name}
                        name={product?.name}
                        categoryName={product?.category.name}
                        needsRestock={needsRestock}
                    />

                    <ProductInfoGrid
                        product={product}
                        needsRestock={needsRestock}
                    />

                </ContentContainer>

                <ProductTabs product={product} />

            </Grid>




        </Grid>
    )
}