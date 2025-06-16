import {GetProductSaleInsightsDTO} from "../api/dto/product/GetProductSaleInsights.dto.ts";

export const SALES_INSIGHTS_KEY = (dto: GetProductSaleInsightsDTO) => ["salesInsights", dto];

export const PRODUCT_STOCK_MOVEMENTS_KEY = (productId: number) => ["productStockMovements", productId];

export const PRODUCT_ACTIVITY_LOG_KEY = (productId: number) => ["productActivityLog", productId];