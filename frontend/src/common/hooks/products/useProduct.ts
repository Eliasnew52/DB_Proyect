import {useQuery} from "@tanstack/react-query";
import {PRODUCT_KEY} from "./queryKeys.ts";
import {getProductById} from "../../api/fetchers/products/productsFetchers.ts";

export const useProduct = (id: number) => {
    return useQuery({ queryKey: PRODUCT_KEY(id), queryFn: ({ signal }) => getProductById(id, signal) })
}