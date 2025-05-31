import {useQuery} from "@tanstack/react-query";
import {BRANDS_KEY} from "../queryKeys.ts";
import {getBrands} from "../../../common/api/fetchers/brandsFetchers.ts";

export const useBrands = () => {
    return useQuery({ queryKey: BRANDS_KEY, queryFn: ({ signal }) => getBrands(signal) });
}