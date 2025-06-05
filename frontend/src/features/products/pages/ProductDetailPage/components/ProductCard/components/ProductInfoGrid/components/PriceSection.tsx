import {Grid, Typography} from "@mui/material";
import {formatPrice} from "../../../../../../../../../common/utils/formatPrice.ts";

export const PriceSection = ({ salePrice, purchasePrice }: { salePrice?: number, purchasePrice?: number }) => {
    return (
        <Grid
            container
            spacing={20}
        >
            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <Grid>
                    <Typography
                        fontSize={14}
                        color={'grey.600'}
                    >
                        Precio Venta
                    </Typography>
                </Grid>

                <Grid>
                    <Typography
                        fontSize={20}
                        fontWeight={'bold'}
                    >
                        { formatPrice(salePrice) }
                    </Typography>
                </Grid>
            </Grid>

            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <Grid>
                    <Typography
                        fontSize={14}
                        color={'grey.600'}
                    >
                        Precio Compra
                    </Typography>
                </Grid>

                <Grid>
                    <Typography
                        fontSize={20}
                        fontWeight={'bold'}
                    >
                        { formatPrice(purchasePrice) }
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}