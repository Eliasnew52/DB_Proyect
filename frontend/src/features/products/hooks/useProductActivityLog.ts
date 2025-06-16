import {useQuery} from "@tanstack/react-query";
import {PRODUCT_ACTIVITY_LOG_KEY} from "./queryKeys.ts";
import {getProductActivityLogById} from "../api/fetchers/productsFetchers.ts";

export const useProductActivityLog = (productId: number, page: number) => {
    return useQuery({
        queryKey: PRODUCT_ACTIVITY_LOG_KEY(productId),
        queryFn: ({ signal }) => getProductActivityLogById(productId, page, signal),
        enabled: !!productId && (
            page > 0
        )
    })
}