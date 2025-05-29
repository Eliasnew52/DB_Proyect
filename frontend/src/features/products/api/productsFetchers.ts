import axiosClient from "../../../common/api/axiosClient.ts";
import {Product} from "../../../common/types/products.types.ts";
import {ApiResponseTypes} from "../../../common/types/apiResponse.types.ts";

export const getProducts = async (signal?: AbortSignal): Promise<Product> => {
    const res = await axiosClient.get('/products/', { signal })
    return res.data.result;
}

export const createProduct = async (product: Product): Promise<ApiResponseTypes<Product>> => {
    const res = await axiosClient.post<ApiResponseTypes<Product>>('/products/', product);
    return res.data;
}