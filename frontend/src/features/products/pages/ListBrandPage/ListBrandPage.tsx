import {Grid, Typography} from "@mui/material";
import {BrandTable} from "./components/BrandTable/BrandTable.tsx";

export const ListBrandPage = () => {

    return (
        <Grid>
            <Grid container flexDirection={"column"} marginBottom={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
                    Lista de marcas
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray" }}>
                    Maneja tus marcas
                </Typography>
            </Grid>

            <BrandTable />

        </Grid>
    )
}