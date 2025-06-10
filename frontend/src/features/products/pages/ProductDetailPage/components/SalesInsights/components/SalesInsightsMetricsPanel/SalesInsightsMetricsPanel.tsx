import {Box, Typography} from "@mui/material";
import {SalesMetricCard} from "./components/SalesMetricCard/SalesMetricCard.tsx";
import {SalesMetricCardSkeleton} from "./components/SalesMetricCardSkeleton.tsx";
import {ProductSaleInsights} from "../../../../../../domain/ProductSaleInsights.types.ts";
import {formatDate} from "../../../../../../../../common/utils/formatDate.ts";

export const SalesInsightsMetricsPanel = ({ data, isLoading }: { data?: ProductSaleInsights, isLoading: boolean }) => {

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: 1
            }}
        >
            {
                isLoading ? (
                    <>
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                        <SalesMetricCardSkeleton />
                    </>
                ) : (
                    <>
                        <SalesMetricCard
                            value={data?.total_units || 0}
                            label={'Unidades totales vendidas'}
                        />
                        <SalesMetricCard
                            label={'Ingresos totales'}
                            prefix={'C$'}
                            decimals={2}
                            value={data?.total_income ?? 0}
                        />
                        {/*<SalesMetricCard*/}
                        {/*    label={'Ingresos diarios promedios'}*/}
                        {/*    prefix={'C$'}*/}
                        {/*    decimals={2}*/}
                        {/*    value={data?.average_income ?? 0}*/}
                        {/*/>*/}
                        <SalesMetricCard
                            label={'Ganancia real por producto'}
                            prefix={'C$'}
                            decimals={2}
                            value={data?.real_profit ?? 0}
                        />
                        <SalesMetricCard
                            label={'Cantidad de ventas'}
                            value={data?.num_sales ?? 0}
                        />
                        <SalesMetricCard
                            label={'Última venta'}
                            prefix={'C$'}
                            decimals={2}
                            value={data?.last_sale?.total_income ?? 0}
                        >
                            <>
                                <Typography
                                    fontSize={14}
                                    color={'grey.600'}
                                >
                                    Unidades vendidas: { data?.last_sale?.units_sold ?? 0 }
                                </Typography>
                                <Typography
                                    fontSize={14}
                                    color={'grey.600'}
                                >
                                    {formatDate(data?.last_sale?.date)}
                                </Typography>
                            </>
                        </SalesMetricCard>
                        <SalesMetricCard
                            label={'Venta máxima'}
                            prefix={'C$'}
                            decimals={2}
                            value={data?.max_sale?.total_income ?? 0}
                        >
                            <Typography
                                fontSize={14}
                                color={'grey.600'}
                            >
                                Unidades vendidas: { data?.max_sale?.units_sold ?? 0 }
                            </Typography>
                            <Typography
                                fontSize={14}
                                color={'grey.600'}
                            >
                                {formatDate(data?.last_sale?.date)}
                            </Typography>
                        </SalesMetricCard>
                        {/*<SalesMetricCard*/}
                        {/*    label={'Promedio de unidades'}*/}
                        {/*    decimals={2}*/}
                        {/*    value={data?.average_units ?? 0}*/}
                        {/*/>*/}
                        <SalesMetricCard
                            label={'Periodos sin ventas'}
                            value={data?.zero_sales_periods ?? 0}
                        />
                        <SalesMetricCard
                            label={'Días desde la última venta'}
                            value={data?.days_since_last_sale ?? 0}
                        />
                        <SalesMetricCard
                            label={'Ticket promedio'}
                            prefix={'C$'}
                            decimals={2}
                            value={data?.ticket_average ?? 0}
                        />

                    </>
                )
            }


        </Box>
    )
}