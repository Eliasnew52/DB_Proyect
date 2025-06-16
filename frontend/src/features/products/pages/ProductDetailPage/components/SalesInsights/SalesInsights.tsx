import {useState} from "react";
import {ContentContainer} from "../../../../../../common/components/ui/ContentContainer.tsx";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {SectionHeader} from "../../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {SalesInsightsFilter} from "./components/SalesInsightsFilter/SalesInsightsFilter.tsx";
import {SalesInsightsMetricsPanel} from "./components/SalesInsightsMetricsPanel/SalesInsightsMetricsPanel.tsx";
import {SalesInsightsChartPanel} from "./components/SalesInsightsChartPanel/SalesInsightsChartPanel.tsx";
import {Grid} from "@mui/material";
import {useProductSalesInsights} from "../../../../hooks/useProductSalesInsights.ts";
import {ProductSaleInsightsFormValues} from "./types/form.types.ts";

export const SalesInsights = ({ productId }: { productId?: number }) => {
    const [filters, setFilters] = useState<ProductSaleInsightsFormValues>({ product_id: productId, period: 'd' })
    const { data, isLoading } = useProductSalesInsights(filters);

    return (
        <ContentContainer
            sx={{
                gap: 3,
            }}
        >
            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <SectionHeader
                    title={'Insights de ventas'}
                    Icon={TrendingUpIcon}
                />

                <SalesInsightsFilter productId={productId} setFilters={setFilters} />
            </Grid>

            <SalesInsightsMetricsPanel data={data} isLoading={isLoading} />

            <SalesInsightsChartPanel data={data} loading={isLoading}  />
        </ContentContainer>
    )
}