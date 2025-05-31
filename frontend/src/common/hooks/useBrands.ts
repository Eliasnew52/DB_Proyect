import {useQuery} from "@tanstack/react-query";
import {BRANDS_KEY} from "../api/fetchers/products/queryKeys.ts";
import {getBrands} from "../api/fetchers/products/brandsFetchers.ts";

export const useBrands = () => {
    return useQuery({ queryKey: BRANDS_KEY, queryFn: ({ signal }) => getBrands(signal) });
}