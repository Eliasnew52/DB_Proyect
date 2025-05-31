import {CircularProgress, Grid, Typography} from "@mui/material";

export const InlineLoading = ({ message = 'Loading...', color = 'primary' }) => {

    return (
        <Grid container spacing={1} alignItems={'center'} marginY={1}>
            <CircularProgress size={14} color={color} />
            <Typography>
                {message}
            </Typography>
        </Grid>
    )
}