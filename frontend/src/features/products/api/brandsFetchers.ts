import axiosClient from "../../../common/api/axiosClient.ts";
import {ApiResponse} from "../../../common/types/apiResponse.ts";
import {Brand} from "../types/brands.types.ts";

export const getBrands = async (signal?: AbortSignal): Promise<Brand[]> => {
    const res = await axiosClient.get<ApiResponse<Brand[]>>('/brands/', { signal });
    return res.data.result;
}

export const createBand = async (brand: Brand): Promise<ApiResponse<Brand>> => {
    const res = await axiosClient.post<ApiResponse<Brand>>('/brands/', brand, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export const updateBrand = async(brand: Brand): Promise<ApiResponse<Brand>> => {
    const res = await axiosClient.patch<ApiResponse<Brand>>(`/brands/${brand.id}/`, {
        ...brand
    }, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return res.data;
}

export const deactivateBrand = async(brandId: number, signal?: AbortSignal): Promise<ApiResponse<Brand>> => {
    const res = await axiosClient.delete<ApiResponse<Brand>>(`/brands/${brandId}/`, { signal });
    return res.data;
}