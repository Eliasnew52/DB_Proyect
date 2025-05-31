import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {Grid, Typography} from "@mui/material";

export const EmpyCart = () => {
    return (
        <Grid
            container
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
        >
            <ShoppingCartOutlinedIcon />
            <Typography>
                El carrito está vacío.
            </Typography>
        </Grid>
    )
}