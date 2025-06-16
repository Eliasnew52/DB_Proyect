import {ProductSaleInsights} from "../../../domain/ProductSaleInsights.types.ts";
import {ProductSaleInsightsResponseDTO} from "../../dto/product/ProductSaleInsightsResponse.dto.ts";
import {ProductActivityLogResponseDTO} from "../../dto/product/ProductActivityLogResponse.dto.ts";
import {ProductActivityLog} from "../../../domain/ProductActivityLog.types.ts";

export const mapProductSaleInsights = (dto: ProductSaleInsightsResponseDTO): ProductSaleInsights => {
    return {
        total_units: dto.total_units,
        total_income: dto.total_income,
        average_income: dto.average_income,
        average_units: dto.average_units,
        zero_sales_periods: dto.zero_sales_periods,
        last_sale: dto.last_sale,
        max_sale: dto.max_sale,
        real_profit: dto.real_profit,
        percent_periods_with_sales: dto.percent_periods_with_sales,
        num_sales: dto.num_sales,
        days_since_last_sale: dto.days_since_last_sale,
        ticket_average: dto.ticket_average,
        trend: dto.trend,
    }
}

export const mapProductActivityLogDTOToProductActivityLog = (dto:  ProductActivityLogResponseDTO): ProductActivityLog => {
    return {
        id: dto.id,
        history_id: dto.history_id,
        history_date: dto.history_date,
        history_user: dto.history_user,
        history_type: dto.history_type,
        history_change_reason: dto.history_change_reason,
        name: dto.name,
        changes: dto.changes,
    }
}