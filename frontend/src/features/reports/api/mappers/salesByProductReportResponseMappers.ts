import {ResultDTO, TotalsDTO} from "../dto/SalesByProductResponse.dto.ts";
import {Result, Totals} from "../../domain/SalesByProductReport.ts";

export const mapResultDTOToResult = (resultDTO: ResultDTO): Result => {
    return {
        product: resultDTO.product,
        quantity_sold: resultDTO.quantity_sold,
        net_revenue: resultDTO.net_revenue,
        total_cost: resultDTO.total_cost,
        total_margin: resultDTO.total_margin,
        margin_pct: resultDTO.margin_pct,
    };
};

export const mapTotalsDTOToTotals = (totalsDTO: TotalsDTO): Totals => {
    return {
        quantity_sold: totalsDTO.quantity_sold,
        net_revenue:   totalsDTO.net_revenue,
        total_cost:    totalsDTO.total_cost,
        total_margin:  totalsDTO.total_margin,
        margin_pct:    totalsDTO.margin_pct,
        total_products: totalsDTO.total_products,
    };
};