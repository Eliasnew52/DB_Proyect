import {Grid, Typography} from "@mui/material"
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const SalesInsightsHeader = () => {
    return (
        <Grid
            container
            alignItems={'center'}
            spacing={1}

        >
            <TrendingUpIcon />
            <Grid>
                <Typography>
                    Hallazgos de ventas del producto
                </Typography>
            </Grid>


        </Grid>
    )
}