import {Product} from "../../../../../../../../common/types/products.types.ts";
import {PriceSection} from "./components/PriceSection.tsx";
import {StockSection} from "./components/StockSection.tsx";

export const ProductInfoGrid = ({ product, needsRestock }: { product?: Product, needsRestock: boolean }) => {

    return (
        <>
            <PriceSection
                salePrice={product?.sale_price}
                purchasePrice={product?.purchase_price}
            />

            <StockSection
                stock={product?.stock}
                minimumStock={product?.minimum_stock}
                needsRestock={needsRestock}
            />
        </>
    )
}