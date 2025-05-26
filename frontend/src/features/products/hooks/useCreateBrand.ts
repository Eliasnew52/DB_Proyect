import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Brand} from "../../../common/types/brands.types.ts";
import {createBand,} from "../api/brandsFetchers.ts";
import {BRANDS_KEY} from "../queryKeys.ts";
import {CustomError} from "../../../common/types/customError.types.ts";

export const useCreateBrand = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (newBrand: Brand) => createBand(newBrand),

        onMutate: async newBrand => {
            await qc.cancelQueries({ queryKey: BRANDS_KEY })
            const previous = qc.getQueryData<Brand[]>(BRANDS_KEY)

            qc.setQueryData<Brand[]>(BRANDS_KEY, old => [
                ...(old || []),
                {
                    ...newBrand,
                    id: new Date().getTime(),
                    active: true,
                } as Brand
            ])

            return { previous }
        },


        onError: (_error: CustomError, _newBrand, context) => {
            if (context?.previous) {
                qc.setQueryData(BRANDS_KEY, context.previous)
            }
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: BRANDS_KEY })
        },

    })

}