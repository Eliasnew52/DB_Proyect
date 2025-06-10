import {ChartDataPoint} from "../../SalesInsightsChartPanel.types.ts";

export interface ProductSalesTrendChartProps {
    salesData: ChartDataPoint[];
    loading: boolean;
}
