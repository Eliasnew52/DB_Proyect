export interface TrendItemDTO {
    period: string;
    units_sold: number;
    total_income: number;
}

export interface ProductSaleInsightsResponseDTO {
    total_units: number;
    total_income: number;
    average_income: number;
    trend: TrendItemDTO[];
}