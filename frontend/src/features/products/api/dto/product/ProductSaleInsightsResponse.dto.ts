export interface maxSaleDTO {
    date: string;
    units_sold: number;
    total_income: number;
}

export interface lastSaleDTO {
    date: string;
    units_sold: number;
    total_income: number;
}

export interface TrendItemDTO {
    period: string;
    units_sold: number;
    total_income: number;
}

export interface ProductSaleInsightsResponseDTO {
    total_units: number;
    total_income: number;
    average_income: number;
    average_units: number;
    zero_sales_periods: number;
    max_sale: maxSaleDTO;
    last_sale: lastSaleDTO;
    real_profit: number;
    ticket_average: number;
    num_sales: number;
    days_since_last_sale: number;
    percent_periods_with_sales: number;
    trend: TrendItemDTO[];
}