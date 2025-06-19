import {Grid} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";

export const SalesByReportPage = () => {
    return (
        <Grid>
            <SectionHeader
                title={'Ventas por producto'}
                subtitle={'Análisis de ingresos, costos y márgenes por producto'}
            />
        </Grid>
    )
}