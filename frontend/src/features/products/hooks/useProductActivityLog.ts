import {useQuery} from "@tanstack/react-query";
import {PRODUCT_ACTIVITY_LOG_KEY} from "./queryKeys.ts";
import {getProductActivityLogById} from "../api/fetchers/productsFetchers.ts";

export const useProductActivityLog = (productId: number, page: number, pageSize: number) => {
    return useQuery({
        queryKey: PRODUCT_ACTIVITY_LOG_KEY(productId, page, pageSize),
        queryFn: ({ signal }) => getProductActivityLogById(productId, page, pageSize, signal),
        enabled: !!productId && (
            page > 0
        )
    })
}