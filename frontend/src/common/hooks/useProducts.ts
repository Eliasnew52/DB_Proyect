import {useQuery} from "@tanstack/react-query";
import {PRODUCTS_KEY} from "../queryKeys.ts";
import {getProducts} from "../../../common/api/fetchers/productsFetchers.ts";

export const useProducts = () => {
    return useQuery({ queryKey: PRODUCTS_KEY, queryFn: ({ signal }) => getProducts(signal) })
}