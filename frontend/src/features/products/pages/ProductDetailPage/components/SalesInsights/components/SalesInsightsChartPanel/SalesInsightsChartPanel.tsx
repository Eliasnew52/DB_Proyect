import {Grid} from "@mui/material";
import {ProductSalesTrendChart} from "./components/ProductSalesTrendChart.tsx";
import {ProductRevenueTrendChart} from "./components/ProductRevenueTrendChart.tsx";

export const SalesInsightsChartPanel = () => {
  return (
      <Grid
        container
        flexDirection={'column'}
        spacing={2}
      >
          <ProductSalesTrendChart />
          <ProductRevenueTrendChart />
      </Grid>
  )
};