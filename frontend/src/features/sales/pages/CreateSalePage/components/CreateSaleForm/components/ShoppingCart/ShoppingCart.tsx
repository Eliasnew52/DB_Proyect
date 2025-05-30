import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Box, Grid, Stack, Typography} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {CartItem, CartItems} from "./components/CartItem.tsx";

export const ShoppingCart = ({ items }) => {

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

                {/*{*/}
                {/*    items.length === 0 ? (*/}
                {/*        <Grid*/}
                {/*            container*/}
                {/*            flexDirection={'column'}*/}
                {/*            justifyContent={'center'}*/}
                {/*            alignItems={'center'}*/}
                {/*        >*/}
                {/*            <ShoppingCartOutlinedIcon />*/}
                {/*            <Typography>*/}
                {/*                El carrito está vacío.*/}
                {/*            </Typography>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        <></>*/}
                {/*    )*/}
                {/*}*/}
                <Box
                    sx={{
                        overflowY: 'auto',
                    }}
                >
                    <Stack spacing={1}>
                        <CartItem />
                        <CartItem />
                        <CartItem />
                        <CartItem />
                        <CartItem />
                    </Stack>
                </Box>

            </ContentContainer>

        </Grid>

    )
}