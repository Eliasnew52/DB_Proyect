import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import {SectionHeader} from "../../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {
    Grid,
} from "@mui/material";
import {BrandField} from "./components/BrandField.tsx";
import {SuppliersField} from "./components/SuppliersField.tsx";
import {ProductStockAndPricingFields} from "./components/ProductStockAndPricingFields.tsx";
import {ProductDynamicAttributes} from "./components/ProductDynamicAttributes.tsx";
import type {Category} from "../../../../../../common/domain/products/categories.types.ts";

export const ProductDetailsForm = ({ selectedCategory }: { selectedCategory: Category | null }) => {

    return (
        <ContentContainer>
            <Grid container flexDirection={'column'} spacing={1}>
                <SectionHeader
                    title={'Detalles del producto'}
                    subtitle={'Especificar información y especificaciones detalladas del producto'}
                    isRequired
                />
                <BrandField />
                <SuppliersField />
                <ProductStockAndPricingFields />
                <ProductDynamicAttributes selectedCategory={selectedCategory} />
            </Grid>
        </ContentContainer>
    )
}