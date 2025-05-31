import {useQuery} from "@tanstack/react-query";
import {CATEGORIES_KEY} from "../api/fetchers/products/queryKeys.ts";
import {getCategories} from "../api/fetchers/products/categoriesFetchers.ts";

export const useCategories = () => {
    return useQuery({ queryKey: CATEGORIES_KEY, queryFn: ({ signal }) => getCategories(signal) })
}