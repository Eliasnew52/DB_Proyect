import {Grid, Typography} from "@mui/material";
import {CreateCategoryForm} from "./components/CreateCategoryForm.tsx";

export const CreateCategoryPage = () => {
    return (
        <Grid>
            <Grid container flexDirection={"column"} marginBottom={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
                    Lista de categorías
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray" }}>
                    Maneja tus categorías
                </Typography>
            </Grid>

            <CreateCategoryForm />
        </Grid>
    )
}