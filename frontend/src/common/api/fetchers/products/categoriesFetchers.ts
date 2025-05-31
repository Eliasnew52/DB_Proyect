import axiosClient from "../axiosClient.ts";
import {Category} from "../../types/categories.types.ts";
import {ApiResponseTypes} from "../../types/apiResponse.types.ts";

export const getCategories = async(signal?: AbortSignal): Promise<Category[]> => {
    const res = await axiosClient.get<ApiResponseTypes<Category[]>>('/categories/', { signal });
    return res.data.result;
}

export const createCategory = async (category: Category): Promise<ApiResponseTypes<Category>> => {
    const res = await axiosClient.post<ApiResponseTypes<Category>>('/categories/', category, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export const updateCategory = async (category: Category): Promise<ApiResponseTypes<Category>> => {
    const res = await axiosClient.patch<ApiResponseTypes<Category>>(`/categories/${category.id}`, category, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data
}