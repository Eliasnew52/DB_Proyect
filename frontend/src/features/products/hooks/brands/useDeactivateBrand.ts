import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deactivateBrand} from "../../../common/api/fetchers/products/brandsFetchers.ts";
import {BRAND_KEY, BRANDS_KEY} from "../../../common/hooks/products/queryKeys.ts";
import {useNotifications} from "../../../common/hooks/useNotifications.ts";
import {CustomError} from "../../../common/types/customError.types.ts";

export const useDeactivateBrand = () => {
    const qc = useQueryClient();
    const { showSuccess, showError } = useNotifications();

    return useMutation({
        mutationFn: (brandId: number) => deactivateBrand(brandId),

        onSuccess: (response, brandId) => {
            qc.invalidateQueries({ queryKey: BRANDS_KEY });
            qc.invalidateQueries({ queryKey: BRAND_KEY(brandId) });

            showSuccess(response.message);
        },

        onError: (error: CustomError) => {
            showError(error);
        }
    })

}