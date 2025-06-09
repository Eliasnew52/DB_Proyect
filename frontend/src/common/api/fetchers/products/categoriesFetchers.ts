import axiosClient from "../../axiosClient.ts";
import {Category} from "../../../domain/products/categories.types.ts";
import {ApiResponseTypes} from "../../../types/apiResponse.types.ts";
import {CreateCategoryDTO} from "../../../../features/products/api/dto/category/CreateCategory.dto.ts";
import {CategoryResponse} from "../../../../features/products/api/dto/category/CategoryResponse.dto.ts";

export const getCategories = async(signal?: AbortSignal): Promise<CategoryResponse[]> => {
    const res = await axiosClient.get<ApiResponseTypes<CategoryResponse[]>>('/categories/', { signal });
    return res.data.result;
}

export const createCategory = async (category: CreateCategoryDTO): Promise<ApiResponseTypes<CategoryResponse>> => {
    const res = await axiosClient.post<ApiResponseTypes<CategoryResponse>>('/categories/', category, {
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