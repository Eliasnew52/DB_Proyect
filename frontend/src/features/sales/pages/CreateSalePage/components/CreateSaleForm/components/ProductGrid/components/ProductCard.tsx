import {Button, Card, CardContent, CardMedia, Chip, Grid, Typography} from "@mui/material";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import placeholderImg from '../../../../../../../../../assets/placeholder.svg'

export const ProductCard = () => {
    return (
        <Card
            sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                position: 'relative',
            }}
            elevation={0}
        >
            <Chip
                label="Nuevo"
                color="success"
                variant="filled"
                size={'small'}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    m: 1,
                }}
            />

            <Chip
                label="¡Quedan 4!"
                color="error"
                variant="filled"
                size={'small'}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    m: 1,
                }}
            />

            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={placeholderImg}
            />
            <CardContent>

                <Grid
                    container
                    flexDirection={'column'}
                    spacing={2}
                >
                    <Grid
                        container
                        flexDirection={'column'}
                        spacing={0}
                    >
                        <Grid>
                            <Typography fontWeight={'bold'}>
                                Lizard
                            </Typography>
                        </Grid>

                        <Grid>
                            <Typography
                                fontWeight={"bold"}
                                fontSize={15}
                            >
                                C$ 38.00
                            </Typography>
                        </Grid>

                        <Grid>
                            <Typography fontSize={14} fontWeight={600} color={'textDisabled'}>
                                Stock: 60
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={1}
                        width={'100%'}
                        justifyContent={'end'}
                    >
                        <Button
                            variant={'outlined'}
                            size={'medium'}
                            startIcon={<RemoveRedEyeOutlinedIcon />}
                            sx={{
                                '.MuiButton-startIcon': {
                                    margin: 0, padding: 0
                                }
                            }}
                        />
                        <Button
                            variant={'contained'}
                            size={'small'}
                            startIcon={<AddOutlinedIcon />}
                            sx={{
                                '.MuiButton-startIcon': {
                                    margin: 0, padding: 0
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}