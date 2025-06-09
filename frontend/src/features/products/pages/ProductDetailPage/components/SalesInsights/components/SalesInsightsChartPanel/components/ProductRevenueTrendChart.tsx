import {Grid, Typography} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';

export const ProductRevenueTrendChart = () => {
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
              xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              height={300}
          />
      </Grid>
  );
};