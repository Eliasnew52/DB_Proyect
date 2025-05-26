import {CircularProgress, Grid, Typography} from "@mui/material";
import {OverlayLoadingProps} from "./OverlayLoading.types.ts";

export const OverlayLoading = ({ message = 'Cargando...' }: OverlayLoadingProps) => {
    return (
        <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
        >
            <Grid
                container
                flexDirection={'column'}
                alignItems={'center'}
            >
                <CircularProgress />
                <Typography>
                    {message}
                </Typography>
            </Grid>
        </Grid>
    )
}