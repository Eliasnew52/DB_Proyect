import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Product} from "../../../common/types/products.types.ts";
import {createProduct} from "../api/productsFetchers.ts";
import {PRODUCTS_KEY} from "../queryKeys.ts";

export const useCreateProduct = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (newProduct: Product) => createProduct(newProduct),

        onSettled: () => {
            qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
        }
    })
}