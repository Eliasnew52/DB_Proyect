import {GetProductSaleInsightsDTO} from "../api/dto/product/GetProductSaleInsights.dto.ts";

export const SALES_INSIGHTS_KEY = (dto: GetProductSaleInsightsDTO) => ["salesInsights", dto];

export const PRODUCT_STOCK_MOVEMENTS_KEY = (productId: number, page: number, pageSize: number) => ["productStockMovements", productId, page, pageSize];

export const PRODUCT_ACTIVITY_LOG_KEY = (productId: number, page: number, pageSize: number) => ["productActivityLog", productId, page, pageSize];