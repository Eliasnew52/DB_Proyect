import axiosClient from "../../axiosClient.ts";
import {Product} from "../../../types/products.types.ts";
import {ApiResponseTypes, PaginatedResponse} from "../../../types/apiResponse.types.ts";

export const getProducts = async (signal?: AbortSignal): Promise<Product> => {
    const res = await axiosClient.get('/products/', { signal })
    return res.data.result;
}

export const getProductsPaginated = async (search: string, categoryId: number | null, page: number, signal?: AbortSignal): Promise<PaginatedResponse> => {
    const params: Record<string, string | number> = { page }
    if (search.trim() !== '') {
        params.search = search
    }
    if (categoryId !== null) {
        params.category = categoryId
    }


    const res = await axiosClient.get<ApiResponseTypes<PaginatedResponse>>('/products/', {
        params,
        signal
    });
    return res.data.result;
}

export const createProduct = async (product: Product): Promise<ApiResponseTypes<Product>> => {
    const res = await axiosClient.post<ApiResponseTypes<Product>>('/products/', product);
    return res.data;
}