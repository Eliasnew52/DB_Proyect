import React, {memo} from 'react'
import {Box, Grid, Typography} from '@mui/material'
import { ProductCard } from './components/ProductCard'
import {useInfiniteProducts} from "../../../../../../../../common/hooks/useInfiniteProducts.ts";
import {Product} from "../../../../../../../../common/types/products.types.ts";
import {OverlayLoading} from "../../../../../../../../common/components/ui/OverlayLoading/OverlayLoading.tsx";
import {InlineLoading} from "../../../../../../../../common/components/ui/InlineLoading/InlineLoading.tsx";
import {useInView} from "react-intersection-observer";
import {NoResults} from "../SearchBar/components/NoResults.tsx";

interface Props {
    search: string
    category: number | null
}

export const    ProductGrid: React.FC<Props> = memo(({ search, category }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteProducts({ search, category })
    const allProducts: Product[] = data?.pages.flatMap(p => p.results) ?? []

    const { ref, inView } = useInView()

    React.useEffect(() => {
        if (inView && hasNextPage) fetchNextPage()
    }, [inView, hasNextPage, fetchNextPage])

    if (isLoading) {
        return (
            <OverlayLoading message={'Cargando productos...'} />
        )
    }

    if (allProducts.length === 0) {
        return <NoResults search={search} />
    }

    if (isError) {
        return (
            <Typography color="error" textAlign="center" p={4}>
                Error: {String(error)}
            </Typography>
        )
    }

    return (
        <Grid
            overflow={'hidden'}
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: 1,
            }}
        >
            {
                allProducts.length > 0 && allProducts.map(product => (
                    <ProductCard product={product} key={product.id} />
                ))
            }

            <Box
                ref={ref}
            >
                {
                    isFetchingNextPage && (
                        <InlineLoading message={'Cargando productos...'} />
                    )
                }
            </Box>


        </Grid>
    )
})
