export interface maxSalesPeriod {
    date: string;
    units_sold: number;
    total_income: number;
}

export interface lastSalesPeriod {
    date: string;
    units_sold: number;
    total_income: number;
}

export interface TrendItem {
    period: string;
    units_sold: number;
    total_income: number;
}

export interface ProductSaleInsights {
    total_units: number;
    total_income: number;
    average_income: number;
    average_units: number;
    zero_sales_periods: number;
    max_sale: maxSalesPeriod;
    last_sale: lastSalesPeriod;
    real_profit: number;
    ticket_average: number;
    num_sales: number;
    days_since_last_sale: number;
    percent_periods_with_sales: number;
    trend: TrendItem[];
}