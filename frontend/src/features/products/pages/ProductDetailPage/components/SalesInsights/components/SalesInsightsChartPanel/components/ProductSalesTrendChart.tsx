import {Grid, Typography} from "@mui/material";
import {LineChart} from "@mui/x-charts";

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

export const ProductSalesTrendChart = () => {
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
                series={[
                    { data: pData, label: 'pv' },
                    { data: uData, label: 'uv' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
            />
        </Grid>
    )
}