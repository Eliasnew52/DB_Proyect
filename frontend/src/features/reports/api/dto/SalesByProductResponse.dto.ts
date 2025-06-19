
export interface ResultDTO {
    product: string;
    quantity_sold: number;
    net_revenue: number;
    total_cost: number;
    total_margin: number;
    margin_pct: number;
}

 export interface TotalsDTO {
     quantity_sold: number;
     net_revenue: number;
     total_cost: number;
     total_margin: number;
     margin_pct: number;
     total_products: number;
 }