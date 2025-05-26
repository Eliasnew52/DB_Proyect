import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Category} from "../types/categories.types.ts";
import {createCategory} from "../api/categoriesFetchers.ts";
import { CATEGORIES_KEY} from "../queryKeys.ts";
import {Brand} from "../types/brands.types.ts";
import {CustomError} from "../../../common/types/customError.types.ts";

export const useCreateCategory = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (newCategory: Category)=> createCategory(newCategory),

        onMutate: async newCategory => {
            await qc.cancelQueries({ queryKey: CATEGORIES_KEY });
            const previous = qc.getQueryData<Brand[]>(CATEGORIES_KEY)

            qc.setQueryData<Category[]>(CATEGORIES_KEY, old => [
                ...(old || []),
                {
                    ...newCategory,
                    id: new Date().getTime(),
                    active: true,
                } as Category
            ])

            return { previous }
        },

        onError: (_error: CustomError, _newCategory, context) => {
            if (context?.previous) {
                qc.setQueryData(CATEGORIES_KEY, context.previous)
            }
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: CATEGORIES_KEY })
        },
    })
}