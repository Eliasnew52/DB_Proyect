import {memo, useMemo} from "react";
import {Button, Card, CardContent, CardMedia, Chip, Grid, Typography} from "@mui/material";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import placeholderImg from '../../../../../../../../../assets/placeholder.svg'
import {Product} from "../../../../../../../../../common/domain/products/products.types.ts";
import { useCartStore } from "../../../../../../../store/useCartStore/useCartStore.ts";

const NEW_PRODUCT_THRESHOLD_DAYS = 30;

export const ProductCard = memo(({ product }: { product: Product }) => {
    const isProductNew = useMemo(() => {
        const createdAt = new Date(product.creation_date);
        const today     = new Date();

        if (isNaN(createdAt.getTime()) || createdAt > new Date()) {
            return false;
        }

        const diffMs  = today.getTime() - createdAt.getTime();
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = diffMs / msPerDay;

        return diffDays <= NEW_PRODUCT_THRESHOLD_DAYS;
    }, [product.creation_date]);

    const addItem = useCartStore(state => state.addItem);

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
            {
                isProductNew && (
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
                )
            }

            {
                product.stock < product.minimum_stock && (
                    <Chip
                        label={`¡Quedan ${product.stock}!`}
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
                )
            }

            <CardMedia
                component="img"
                alt={`${product.name} image`}
                height="140"
                image={product?.image ?? placeholderImg}
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
                                {product.name}
                            </Typography>
                        </Grid>

                        <Grid>
                            <Typography
                                fontWeight={"bold"}
                                fontSize={15}
                            >
                                {product.sale_price.toLocaleString('es-NI', {
                                    style:    'currency',
                                    currency: 'NIO',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Typography>
                        </Grid>

                        <Grid>
                            <Typography fontSize={14} fontWeight={600} color={'textDisabled'}>
                                Stock: {product.stock}
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
                            onClick={() => addItem(product, 1)} // <-- agrega al carrito
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
});