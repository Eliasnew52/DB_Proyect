import axiosClient from "../../axiosClient.ts";
import {Product} from "../../../domain/products/products.types.ts";
import {ApiResponseTypes, PaginatedResponse} from "../../../types/apiResponse.types.ts";
import {ProductResponse} from "../../../../features/products/api/dto/product/ProductResponse.dto.ts";

export const getProducts = async (signal?: AbortSignal, page?: number): Promise<PaginatedResponse<ProductResponse>> => {
    const res = await axiosClient.get<ApiResponseTypes<PaginatedResponse<ProductResponse>>>(`/products/`, { params: { page }, signal })
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

export const createProduct = async (product: FormData): Promise<ApiResponseTypes<Product>> => {
    const res = await axiosClient.post<ApiResponseTypes<Product>>('/products/', product);
    return res.data;
}

export const getProductById = async (id: number, signal?: AbortSignal): Promise<ProductResponse> => {
    const res = await axiosClient.get<ApiResponseTypes<ProductResponse>>(`/products/${id}/`, { signal });
    return res.data.result;
}