import {Chip, Grid, Typography} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export const ProductHeader = ({ name, active, brandName, categoryName, needsRestock }: { name?: string, active?: boolean, brandName?: string, categoryName?: string, needsRestock: boolean }) => {

    return (
        <Grid
            container
            flexDirection={'column'}
            justifyContent={'center'}
            spacing={1}
        >

            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <Grid
                    container
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Grid>
                        <Typography
                            fontSize={18}
                            fontWeight={'bold'}
                        >
                            {name}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Chip
                            size={'small'}
                            color={active ? 'success' : 'error'}
                            label={active ? 'Activo' : 'Inactivo'}
                            sx={{
                                fontWeight: 500,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid>
                    <Typography
                        color={'grey.600'}
                        fontSize={15}
                    >
                        By { brandName }
                    </Typography>
                </Grid>
            </Grid>

            <Grid
                container
                justifyContent={'space-between'}
            >

                <Grid
                    container
                    spacing={1}
                    alignItems="center"
                >
                    <ShoppingBagOutlinedIcon
                        fontSize={'small'}
                        sx={{
                            color: 'grey.600'
                        }}
                    />

                    <Typography
                        color={'grey.600'}
                        fontSize={15}
                    >
                        Categoría:
                    </Typography>

                    <Chip
                        size={'small'}
                        variant={'outlined'}
                        label={categoryName}
                        sx={{
                            fontWeight: 600
                        }}
                    />
                </Grid>

                <Grid>
                    <Chip
                        size={'small'}
                        variant={'outlined'}
                        color={ needsRestock ? 'error' : 'success'}
                        label={ needsRestock ? "Reabastecer" : "En stock" }
                        sx={{
                            fontWeight: 600
                        }}
                    />
                </Grid>

            </Grid>
        </Grid>
    )
}