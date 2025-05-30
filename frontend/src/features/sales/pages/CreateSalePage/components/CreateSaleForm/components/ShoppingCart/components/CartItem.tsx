import {Card, CardActionArea, CardContent, Grid, IconButton, TextField, Typography} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {NumericFormat} from "react-number-format";

export const CartItem = () => {
    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'grey.200'
            }}
        >
            <CardActionArea
                disableTouchRipple
                sx={{
                    height: '100%',
                }}
            >
                <CardContent
                    sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <Grid>
                        <Typography fontSize={14} fontWeight="bold">
                            Lapiceros Premium
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                        >
                            C$300.00
                        </Typography>
                    </Grid>

                    <Grid
                        container
                        alignItems="center"
                    >
                            <NumericFormat
                                customInput={TextField}
                                size={'small'}
                                value={1}
                                sx={{
                                    width: 50,
                                }}
                            />
                        <IconButton color={'error'}>
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </Grid>

                </CardContent>
            </CardActionArea>
        </Card>
    )
}