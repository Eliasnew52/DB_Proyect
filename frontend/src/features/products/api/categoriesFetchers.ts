import axiosClient from "../../../common/api/axiosClient.ts";
import {Category} from "../types/categories.types.ts";
import {ApiResponse} from "../../../common/types/apiResponse.ts";

export const getCategories = async(signal?: AbortSignal): Promise<Category[]> => {
    const res = await axiosClient.get<ApiResponse<Category[]>>('/categories/', { signal });
    return res.data.result;
}

export const createCategory = async (category: Category): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.post<ApiResponse<Category>>('/categories/', category, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export const updateCategory = async (category: Category): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.patch<ApiResponse<Category>>(`/categories/${category.id}`, category, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data
}