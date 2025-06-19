import {Grid} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {SalesByProductTable} from "./components/SalesByProductTable/SalesByProductTable.tsx";

export const SalesByProductReportPage = () => {
    return (
        <Grid>
            <SectionHeader
                title={'Ventas por producto'}
                subtitle={'Análisis de ingresos, costos y márgenes por producto'}
            />

            <SalesByProductTable />

        </Grid>
    )
}