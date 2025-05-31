import {useQuery} from "@tanstack/react-query";
import {PRODUCTS_KEY} from "../api/fetchers/products/queryKeys.ts";
import {getProducts} from "../api/fetchers/products/productsFetchers.ts";

export const useProducts = () => {
    return useQuery({ queryKey: PRODUCTS_KEY, queryFn: ({ signal }) => getProducts(signal) })
}