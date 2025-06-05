import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createProduct} from "../../../common/api/fetchers/products/productsFetchers.ts";
import {PRODUCTS_KEY} from "../../../common/api/fetchers/products/queryKeys.ts";

export const useCreateProduct = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (newProduct: FormData) => createProduct(newProduct),

        onSettled: () => {
            qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
        }
    })
}