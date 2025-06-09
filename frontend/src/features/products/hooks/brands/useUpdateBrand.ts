import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateBrand} from "../../../../common/api/fetchers/products/brandsFetchers.ts";
import {BRAND_KEY, BRANDS_KEY} from "../../../../common/hooks/products/queryKeys.ts";
import {CustomError} from "../../../../common/types/customError.types.ts";
import {Brand} from "../../../../common/domain/products/brands.types.ts";

export const useUpdateBrand = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (brand: Brand) => updateBrand(brand),

        onMutate: async updatedBrand => {
            await qc.cancelQueries({ queryKey: BRANDS_KEY })
            const previous = qc.getQueryData<Brand[]>(BRANDS_KEY)

            qc.setQueryData<Brand[]>(BRANDS_KEY, old =>
                old?.map(b => (b.id === updatedBrand.id ? { ...b, ...updatedBrand } : b)) ?? []
            )
            return { previous }
        },


        onError: (error: CustomError, updatedBrand, context) => {
            if (context?.previous) {
                qc.setQueryData(BRANDS_KEY, context.previous)
            }
        },

        onSettled: (_res, _err, variables) => {
            qc.invalidateQueries({ queryKey: BRANDS_KEY })
            qc.invalidateQueries({ queryKey: BRAND_KEY(variables.id) })
        },

    })
}