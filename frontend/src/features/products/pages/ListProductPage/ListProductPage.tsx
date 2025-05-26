import {Grid, Typography} from "@mui/material";
import {ProductTable} from "./components/ProductTable/ProductTable.tsx";

export const ListProductPage = () => {
    return (
        <Grid>
            <Grid container flexDirection={"column"} marginBottom={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
                    Lista de productos
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray" }}>
                    Maneja tus productos
                </Typography>
            </Grid>

            <ProductTable />
        </Grid>
    )
}