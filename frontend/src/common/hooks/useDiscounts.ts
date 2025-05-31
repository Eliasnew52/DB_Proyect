import {useQuery} from "@tanstack/react-query";
import {DISCOUNT_TYPES_KEY} from "../api/fetchers/sales/queryKeys.ts";
import {getDiscountTypes} from "../api/fetchers/sales/discountsFetchers.ts";

export const useDiscounts = () => {
    return useQuery({ queryKey: DISCOUNT_TYPES_KEY, queryFn: ({ signal }) => getDiscountTypes(signal) });
}