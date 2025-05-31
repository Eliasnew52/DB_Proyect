import { useQuery } from "@tanstack/react-query";
import { SALES_KEY } from "../api/fetchers/sales/queryKeys";
import { getSales } from "../api/fetchers/sales/salesFetchers";

export const useSales = () => {
    return useQuery({
        queryKey: SALES_KEY,
        queryFn: ({ signal }) => getSales(signal),
        staleTime: 1000 * 60 * 2,
    });
};