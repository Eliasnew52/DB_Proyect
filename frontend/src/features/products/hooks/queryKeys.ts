import {GetProductSaleInsightsDTO} from "../api/dto/product/GetProductSaleInsights.dto.ts";

export const SALES_INSIGHTS_KEY = (dto: GetProductSaleInsightsDTO) => ["salesInsights", dto];