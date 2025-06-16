import {useQuery} from "@tanstack/react-query";
import {PRODUCT_STOCK_MOVEMENTS_KEY} from "./queryKeys.ts";
import {getProductStockMovementsById} from "../../../common/api/fetchers/inventory/inventoryFetchers.ts";

export const useProductStockMovements = (productId: number, page: number) => {
    return useQuery({
        queryKey: PRODUCT_STOCK_MOVEMENTS_KEY(productId),
        queryFn: ({ signal }) => getProductStockMovementsById(productId, page, signal),
    })

}