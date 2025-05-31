import axiosClient from "../../axiosClient.ts";
import {ApiResponseTypes} from "../../../types/apiResponse.types.ts";
import {Brand} from "../../../types/brands.types.ts";

export const getBrands = async (signal?: AbortSignal): Promise<Brand[]> => {
    const res = await axiosClient.get<ApiResponseTypes<Brand[]>>('/brands/', { signal });
    return res.data.result;
}

export const createBand = async (brand: Brand): Promise<ApiResponseTypes<Brand>> => {
    const res = await axiosClient.post<ApiResponseTypes<Brand>>('/brands/', brand, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export const updateBrand = async(brand: Brand): Promise<ApiResponseTypes<Brand>> => {
    const res = await axiosClient.patch<ApiResponseTypes<Brand>>(`/brands/${brand.id}/`, {
        ...brand
    }, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return res.data;
}

export const deactivateBrand = async(brandId: number, signal?: AbortSignal): Promise<ApiResponseTypes<Brand>> => {
    const res = await axiosClient.delete<ApiResponseTypes<Brand>>(`/brands/${brandId}/`, { signal });
    return res.data;
}