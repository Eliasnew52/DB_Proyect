import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../api/fetchers/purchases/purchasesFetchers";
import { PURCHASES_KEY } from "../api/fetchers/purchases/queryKeys";

export const usePurchases = () => {
    return useQuery({
        queryKey: PURCHASES_KEY,
        queryFn: ({ signal }) => getPurchases(signal),
        staleTime: 1000 * 60 * 2,
    });
};