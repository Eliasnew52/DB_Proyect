import {useQuery} from "@tanstack/react-query";
import {BRANDS_KEY} from "./queryKeys.ts";
import {getBrands} from "../../api/fetchers/products/brandsFetchers.ts";

export const useBrands = (enabled = true) => {
    return useQuery({ enabled: enabled, queryKey: BRANDS_KEY, queryFn: ({ signal }) => getBrands(signal) });
}