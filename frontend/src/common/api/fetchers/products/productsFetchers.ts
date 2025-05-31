import axiosClient from "../axiosClient.ts";
import {Product} from "../../types/products.types.ts";
import {ApiResponseTypes} from "../../types/apiResponse.types.ts";

export const getProducts = async (signal?: AbortSignal): Promise<Product> => {
    const res = await axiosClient.get('/products/', { signal })
    return res.data.result;
}

export const createProduct = async (product: Product): Promise<ApiResponseTypes<Product>> => {
    const res = await axiosClient.post<ApiResponseTypes<Product>>('/products/', product);
    return res.data;
}