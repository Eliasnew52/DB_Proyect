import axiosClient from "../../axiosClient.ts";
import {ApiResponseTypes} from "../../../types/apiResponse.types.ts";
import {DiscountType} from "../../../domain/sales/discounts.types.ts";

export const getDiscountTypes = async (signal?: AbortSignal): Promise<DiscountType[]> => {
    const res = await axiosClient.get<ApiResponseTypes<DiscountType[]>>('/discount-types/', { signal });
    return res.data.result;
}