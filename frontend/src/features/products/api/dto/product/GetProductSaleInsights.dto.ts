export interface GetProductSaleInsightsDTO {
    product_id: number;
    period: string;
    from_date?: string;
    to_date?: string;
    group_by?: string;
}