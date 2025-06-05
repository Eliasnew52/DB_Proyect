import {useQuery} from "@tanstack/react-query";
import {CATEGORIES_KEY} from "../api/fetchers/products/queryKeys.ts";
import {getCategories} from "../api/fetchers/products/categoriesFetchers.ts";

export const useCategories = (enabled = true) => {
    return useQuery({ enabled: enabled, queryKey: CATEGORIES_KEY, queryFn: ({ signal }) => getCategories(signal) })
}