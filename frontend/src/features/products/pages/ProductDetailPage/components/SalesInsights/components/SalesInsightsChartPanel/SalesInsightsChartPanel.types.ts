import {ProductSaleInsights} from "../../../../../../domain/ProductSaleInsights.types.ts";

export interface ChartDataPoint {
    x: string;
    y: number;
}

export interface SalesInsightsChartPanelProps {
    data: ProductSaleInsights;
    loading: boolean;
}
