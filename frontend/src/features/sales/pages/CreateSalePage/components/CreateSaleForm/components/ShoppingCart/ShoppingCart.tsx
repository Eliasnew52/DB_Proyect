import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {CartItem} from "./components/CartItem.tsx";
import {EmpyCart} from "./components/EmpyCart.tsx";
import {useCartStore} from "../../../../../../store/useCartStore/useCartStore.ts";

export const ShoppingCart = () => {
    const items = useCartStore(state => state.items);

    return (
        <Grid
        >
            <Typography
                sx={{
                    color: '#00000099',
                    fontWeight: 400,
                }}
            >
                Productos en carrito
            </Typography>
            <ContentContainer
                height={'calc(100vh - 600px)'}
                sx={{
                    gap: 1,
                    overflowY: 'auto',
                }}
            >

                {
                    items.length === 0 ? (
                        <EmpyCart />
                    ) : (
                        <Box
                            sx={{
                                overflowY: 'auto',
                            }}
                        >
                            <Stack spacing={1}>
                                {items.map(item => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </Stack>
                        </Box>
                    )
                }


            </ContentContainer>

        </Grid>

    )
}