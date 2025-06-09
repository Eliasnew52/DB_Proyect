import axiosClient from "../../../common/api/axiosClient.ts";
import {ProductSaleInsightsResponseDto} from "../dto/product/ProductSaleInsightsResponse.dto.ts";
import type {ApiResponseTypes} from "../../../common/types/apiResponse.types.ts";

export const getProductSaleInsights = async(signal?: AbortSignal): Promise<ApiResponseTypes<ProductSaleInsightsResponseDto>> => {
    const res = await axiosClient.post<ApiResponseTypes<ProductSaleInsightsResponseDto>>('/products/sales-insights/', {  }, { signal })
    return res.data
}