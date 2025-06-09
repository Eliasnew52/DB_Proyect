import {useQuery} from "@tanstack/react-query";
import {getProductSaleInsights} from "../api/fetchers/productsFetchers.ts";
import {GetProductSaleInsightsDTO} from "../api/dto/product/GetProductSaleInsights.dto.ts";
import {SALES_INSIGHTS_KEY} from "./queryKeys.ts";


export const useProductSalesInsights = (dto: GetProductSaleInsightsDTO) => {

    return useQuery({
        queryKey: SALES_INSIGHTS_KEY(dto),
        queryFn: () => getProductSaleInsights(dto),
        enabled: !!dto.product_id,
    })
}