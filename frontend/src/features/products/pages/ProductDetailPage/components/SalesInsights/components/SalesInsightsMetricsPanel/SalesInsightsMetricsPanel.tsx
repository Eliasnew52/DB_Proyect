import {Box} from "@mui/material";
import {SalesMetricCard} from "./components/SalesMetricCard.tsx";
import {SalesMetricCardSkeleton} from "./components/SalesMetricCardSkeleton.tsx";
import {ProductSaleInsights} from "../../../../../../domain/productSaleInsights.types.ts";

export const SalesInsightsMetricsPanel = ({ data, isLoading }: { data: ProductSaleInsights, isLoading: boolean }) => {

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(30px, 1fr))',
                gap: 1
            }}
        >
            {
                isLoading ? (
                    <>
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                    </>
                ) : (
                    <>
                        <SalesMetricCard value={data?.total_units || 0} label={'Unidades totales vendidas'} />
                        <SalesMetricCard value={data?.total_income || 0} label={'Ingresos totales'} />
                        <SalesMetricCard value={data?.average_income || 0} label={'Ingresos diarios promedios'} />
                    </>
                )
            }


        </Box>
    )
}