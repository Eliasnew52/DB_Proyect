import {Grid, Typography} from "@mui/material";
import {LineChart} from "@mui/x-charts";
import {ProductSalesTrendChartProps} from "./ProductSalesTrendChart.types.ts";

export const ProductSalesTrendChart = ({ salesData, loading }: ProductSalesTrendChartProps ) => {

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
                    Tendencia de ventas
                </Typography>
            </Grid>

            <LineChart
                height={300}
                loading={loading}
                xAxis={[{ data: salesData.map(item => item.x), scaleType: 'band' }]}
                series={[
                    {
                        id: 'sales',
                        label: 'Unidades vendidas',
                        data: salesData.map(item => item.y),
                        color: '#3f51b5',
                        showMark: true
                    }
                ]}
                yAxis={[
                    { id: 'left', scaleType: 'linear' },
                    { id: 'right', scaleType: 'linear' },
                ]}
                margin={{ right: 24 }}
            />
        </Grid>
    )
}