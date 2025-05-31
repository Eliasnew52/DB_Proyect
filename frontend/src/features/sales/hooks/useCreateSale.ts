import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "../../../common/api/fetchers/sales/salesFetchers";
import { PRODUCTS_KEY } from "../../../common/api/fetchers/products/queryKeys";

export const useCreateSale = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createSale,
        onSettled: () => {
            qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
        }
    });
};