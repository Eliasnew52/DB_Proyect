import {useQuery} from "@tanstack/react-query";
import {CATEGORIES_KEY} from "../queryKeys.ts";
import {getCategories} from "../../../common/api/fetchers/categoriesFetchers.ts";

export const useCategories = () => {
    return useQuery({ queryKey: CATEGORIES_KEY, queryFn: ({ signal }) => getCategories(signal) })
}