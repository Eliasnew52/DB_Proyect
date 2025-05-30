import {Grid} from "@mui/material";
import {ProductCard} from "./components/ProductCard.tsx";

export const ProductGrid = () => {
    return (
        <Grid
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: 1,
                overflow: 'hidden'

            }}
        >
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </Grid>
    )
}