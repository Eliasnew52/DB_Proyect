import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPurchase } from "../../../common/api/fetchers/purchases/purchasesFetchers";
import { PURCHASES_KEY } from "../../../common/hooks/purchases/queryKeys.ts";

export const useCreatePurchase = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => createPurchase(formData),
        onSettled: () => {
            qc.invalidateQueries({ queryKey: PURCHASES_KEY });
        }
    });
};