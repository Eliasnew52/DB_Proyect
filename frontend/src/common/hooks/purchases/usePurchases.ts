import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../../api/fetchers/purchases/purchasesFetchers.ts";
import { PURCHASES_KEY } from "./queryKeys.ts";

export const usePurchases = () => {
    return useQuery({
        queryKey: PURCHASES_KEY,
        queryFn: ({ signal }) => getPurchases(signal),
        staleTime: 1000 * 60 * 2,
    });
};