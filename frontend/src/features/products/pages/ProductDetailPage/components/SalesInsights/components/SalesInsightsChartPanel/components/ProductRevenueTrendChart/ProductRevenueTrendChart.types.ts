import {ChartDataPoint} from "../../SalesInsightsChartPanel.types.ts";

export interface ProductRevenueTrendChartProps {
    loading: boolean;
    revenueData: ChartDataPoint[];
}
