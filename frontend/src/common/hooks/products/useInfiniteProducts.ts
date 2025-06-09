import {Product} from "../../domain/products/products.types.ts";
import {useInfiniteQuery} from "@tanstack/react-query";
import {PRODUCTS_KEY} from "./queryKeys.ts";
import {getProductsPaginated} from "../../api/fetchers/products/productsFetchers.ts";

interface PaginatedResponse {
    count: number
    next: string | null
    previous: string | null
    results: Product[]
}

type Params = { search: string; category: number | null }


export const useInfiniteProducts = ({ search, category }: Params) => {
    return useInfiniteQuery<PaginatedResponse>({
        queryKey: [...PRODUCTS_KEY, 'infinite', search, category],
        queryFn: ({ pageParam, signal }) => getProductsPaginated(search, category, pageParam, signal),
        initialPageParam: 1,
        getNextPageParam: last => {
            if (!last.next) return undefined;
            const url = new URL(last.next)
            return Number(url.searchParams.get('page'))
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true,

    })
}