import {ProductSaleInsights} from "../../../domain/productSaleInsights.types.ts";
import {ProductSaleInsightsResponseDTO} from "../../dto/product/ProductSaleInsightsResponse.dto.ts";

export const mapProductSaleInsights = (dto: ProductSaleInsightsResponseDTO): ProductSaleInsights => {
    return {
        total_units: dto.total_units,
        total_income: dto.total_income,
        average_income: dto.average_income,
        trend: dto.trend,
    }
}