export interface GetProductSaleInsightsDTO {
    product_id: number;
    period: string;
    amount?: number;
    from_date?: string;
    to_date?: string;
}