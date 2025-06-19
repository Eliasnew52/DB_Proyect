import {Grid, Typography} from "@mui/material";
import {PurchaseTable} from "./components/PurchaseTable/PurchaseTable.tsx";

export const ListPurchasePage = () => {
    return (
        <Grid>
            <Grid container flexDirection={"column"} marginBottom={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
                    Lista de compras
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray" }}>
                    Consulta y administra tus compras
                </Typography>
            </Grid>
            <PurchaseTable />
        </Grid>
    )
}