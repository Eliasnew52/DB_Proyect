import {useMemo} from "react";
import {Grid} from "@mui/material";
import {ProductSalesTrendChart} from "./components/ProductSalesTrendChart/ProductSalesTrendChart.tsx";
import {ProductRevenueTrendChart} from "./components/ProductRevenueTrendChart/ProductRevenueTrendChart.tsx";
import type {SalesInsightsChartPanelProps} from "./SalesInsightsChartPanel.types.ts";

export const SalesInsightsChartPanel = ({ data, loading }: SalesInsightsChartPanelProps) => {
    const salesData = useMemo(() => data?.trend.map(item => ({ x: item.period, y: item.units_sold })) || [], [data])
    const revenueData = useMemo(() => data?.trend.map(item => ({ x: item.period, y: item.total_income })) || [], [data])

    return (
      <Grid
        container
        flexDirection={'column'}
        spacing={2}
      >
          <ProductSalesTrendChart salesData={salesData}  loading={loading} />
          <ProductRevenueTrendChart revenueData={revenueData} />
      </Grid>
  )
};