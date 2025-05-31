import { Grid, Typography } from "@mui/material";
import { SaleTable } from "./components/SaleTable/SaleTable";

export const ListSalePage = () => {
    return (
        <Grid>
            <Grid container flexDirection={"column"} marginBottom={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
                    Lista de ventas
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray" }}>
                    Consulta y administra tus ventas
                </Typography>
            </Grid>
            <SaleTable />
        </Grid>
    );
};