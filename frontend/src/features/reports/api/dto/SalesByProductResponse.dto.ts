export interface ResultDTO {
    product: string;
    quantity_sold: number;
    net_revenue: number;
    total_cost: number;
    total_margin: number;
    margin_prc: number;
}

 export interface TotalsDTO {
     quantity_sold: number;
     net_revenue: number;
     total_cost: number;
 }

export interface SalesByProductResponseDTO {
    results: ResultDTO[];
    totals: TotalsDTO;
}