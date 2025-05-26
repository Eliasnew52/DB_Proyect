import axiosClient from "../../../common/api/axiosClient.ts";
import {Product} from "../types/products.types.ts";

export const getProducts = async (signal?: AbortSignal): Promise<Product> => {
    const res = await axiosClient.get('/products/', { signal })
    return res.data.result;
}