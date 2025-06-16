import axiosClient from "../../../../common/api/axiosClient.ts";
import {ProductSaleInsightsResponseDTO} from "../dto/product/ProductSaleInsightsResponse.dto.ts";
import type {ApiResponseTypes, PaginatedResponse} from "../../../../common/types/apiResponse.types.ts";
import {
    mapProductActivityLogDTOToProductActivityLog,
    mapProductSaleInsights
} from "../mappers/products/productResponseMappers.ts";
import {GetProductSaleInsightsDTO} from "../dto/product/GetProductSaleInsights.dto.ts";
import {ProductSaleInsights} from "../../domain/ProductSaleInsights.types.ts";
import {ProductActivityLogResponseDTO} from "../dto/product/ProductActivityLogResponse.dto.ts";
import {ProductActivityLog} from "../../domain/ProductActivityLog.types.ts";

export const getProductSaleInsights = async(dto: GetProductSaleInsightsDTO): Promise<ProductSaleInsights> => {
    const res = await axiosClient.post<ApiResponseTypes<ProductSaleInsightsResponseDTO>>('/products/sales-insights/', dto)
    return mapProductSaleInsights(res.data.result)
}

export const getProductActivityLogById = async(productId: number, page: number, signal?: AbortSignal): Promise<PaginatedResponse<ProductActivityLog>> => {
    const res = await axiosClient.get<ApiResponseTypes<PaginatedResponse<ProductActivityLogResponseDTO>>>(`/products/${productId}/history/`, { signal, params: { page } })
    return {
        ...res.data.result,
        results: res.data.result.results.map(mapProductActivityLogDTOToProductActivityLog)
    };
}