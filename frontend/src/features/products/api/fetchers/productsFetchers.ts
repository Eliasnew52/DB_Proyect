import axiosClient from "../../../../common/api/axiosClient.ts";
import {ProductSaleInsightsResponseDTO} from "../dto/product/ProductSaleInsightsResponse.dto.ts";
import type {ApiResponseTypes} from "../../../../common/types/apiResponse.types.ts";
import {mapProductSaleInsights} from "../mappers/products/productResponseMappers.ts";
import {GetProductSaleInsightsDTO} from "../dto/product/GetProductSaleInsights.dto.ts";
import {ProductSaleInsights} from "../../domain/ProductSaleInsights.types.ts";

export const getProductSaleInsights = async(dto: GetProductSaleInsightsDTO): Promise<ProductSaleInsights> => {
    const res = await axiosClient.post<ApiResponseTypes<ProductSaleInsightsResponseDTO>>('/products/sales-insights/', dto)
    return mapProductSaleInsights(res.data.result)
}