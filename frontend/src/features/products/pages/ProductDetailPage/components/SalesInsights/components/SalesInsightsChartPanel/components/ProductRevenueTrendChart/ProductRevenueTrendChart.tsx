import {Grid, Typography} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import {ProductRevenueTrendChartProps} from "./ProductRevenueTrendChart.types.ts";

export const ProductRevenueTrendChart = ({ revenueData, loading }: ProductRevenueTrendChartProps) => {
  return (
      <Grid
          container
          flexDirection={'column'}
          spacing={0}
      >

          <Grid>
              <Typography
                  fontWeight={500}
              >
                  Tendencia de ingresos
              </Typography>
          </Grid>

          <BarChart
              loading={loading}
              xAxis={[{ data: revenueData.map(item => item.x), scaleType: 'band' }]}
              series={[
                  {
                      id: 'revenues',
                      label: 'Ingresos totales',
                      data: revenueData.map(item => item.y),
                  }
              ]}
              height={300}
          />
      </Grid>
  );
};