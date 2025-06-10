import {Grid, Typography} from "@mui/material";
import {ChartsTooltipProps, LineChart} from "@mui/x-charts";
import {ProductSaleInsights} from "../../../../../../../domain/productSaleInsights.types.ts";

const margin = { right: 24 };
type saleData = {
    x: string,
    y: number,
}

interface ProductSalesTrendChartProps {
    salesData: saleData[];
}

const CustomSalesTooltip = ({ axisData, series }: ChartsTooltipProps) => {
    if (!axisData || !axisData.x) return null;

    const index = axisData.index;
    const point = series[0].data[index];
    const maxValue = Math.max(...series[0].data);

    return (
        <div style={{ padding: '8px', background: 'white', border: '1px solid #ccc' }}>
            <strong>{axisData.x}</strong>
            <br />
            {point === maxValue && <span>🔥 Máxima venta<br /></span>}
            Unidades vendidas: {point}
        </div>
    );
};

export const ProductSalesTrendChart = ({ salesData }: ProductSalesTrendChartProps ) => {

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
                margin={margin}
            />
        </Grid>
    )
}