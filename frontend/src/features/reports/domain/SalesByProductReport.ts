export interface Result {
    product: string;
    quantity_sold: number;
    net_revenue: number;
    total_cost: number;
    total_margin: number;
    margin_pct: number;
}

export interface Totals {
    quantity_sold: number;
    net_revenue: number;
    total_cost: number;
    total_margin: number;
    margin_pct: number;
    total_products: number;
}