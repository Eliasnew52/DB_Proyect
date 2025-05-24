import {Card, CardActions, CardContent, Grid, IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const AttributeCard = ({ attribute, removeAttribute }) => {
    return (
        <Card elevation={0} sx={{
            border: "1px solid #E5E5E7",
            padding: 0,
        }}>
            <Grid container justifyContent={'space-between'} alignItems={'center'}>
                <CardContent sx={{height: '100%'}}>
                    <Grid container flexDirection={'column'} spacing={0}>
                        <Typography fontWeight={500}>
                            {attribute.key}
                        </Typography>
                        <Typography fontSize={'small'} color={'textSecondary'}>
                            {attribute.type}
                        </Typography>
                    </Grid>
                </CardContent>
                <CardActions>
                    <IconButton size={'small'} onClick={removeAttribute}>
                        <CloseIcon fontSize={'small'} />
                    </IconButton>
                </CardActions>
            </Grid>
        </Card>
    )
}