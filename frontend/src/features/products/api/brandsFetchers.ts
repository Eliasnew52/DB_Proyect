import axiosClient from "../../../common/api/axiosClient.ts";
import {ApiResponse} from "../../../common/types/apiResponse.ts";
import {Brand} from "../types/brands.types.ts";

export const getBrands = async (signal?: AbortSignal): Promise<Brand[]> => {
    const res = await axiosClient.get<ApiResponse<Brand[]>>('/brands', { signal });
    return res.data.result;
}

export const updateBrand = async(brand: Brand): Promise<Brand> => {
    const res = await axiosClient.patch<ApiResponse<Brand>>(`/brands/${brand.id}`, {
        ...brand
    })
    return res.data.result;
}