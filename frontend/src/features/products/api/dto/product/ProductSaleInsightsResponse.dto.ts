export interface TrendItem {
    period: string;
    units_sold: number;
    total_income: number;
}

export interface ProductSaleInsightsResponseDto {
    total_units: number;
    total_income: number;
    average_income: number;
    trend: TrendItem[];
}