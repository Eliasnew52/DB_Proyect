import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Category} from "../../../common/domain/products/categories.types.ts";
import {createCategory} from "../../../common/api/fetchers/products/categoriesFetchers.ts";
import { CATEGORIES_KEY} from "../../../common/hooks/products/queryKeys.ts";
import {Brand} from "../../../common/domain/products/brands.types.ts";
import {CustomError} from "../../../common/types/customError.types.ts";
import {CreateCategoryDTO} from "../api/dto/category/CreateCategory.dto.ts";
import {mapCreateDTOToCategory} from "../api/mappers/categoryMappers.ts";

export const useCreateCategory = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (newCategory: CreateCategoryDTO)=> createCategory(newCategory),

        onMutate: async newCategory => {
            await qc.cancelQueries({ queryKey: CATEGORIES_KEY });
            const previous = qc.getQueryData<Brand[]>(CATEGORIES_KEY)

            qc.setQueryData<Category[]>(CATEGORIES_KEY, old => [
                ...(old || []),
                mapCreateDTOToCategory(newCategory),
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