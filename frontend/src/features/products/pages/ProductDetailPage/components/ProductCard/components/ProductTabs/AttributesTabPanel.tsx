import type {Product} from "../../../../../../../../common/domain/products/products.types.ts";
import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Grid, Typography} from "@mui/material";

export const AttributesTabPanel = ({ product }: { product?: Product }) => {
    return (
        <ContentContainer>
            { product?.attributes && Object.entries(product?.attributes).map(([ key, value ]) => (
                <Grid
                    container
                    spacing={1}
                >
                    <Grid>
                        <Typography
                            fontWeight={600}
                        >
                            { key }:
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography
                            color={'grey.600'}
                        >
                            { value }
                        </Typography>
                    </Grid>
                </Grid>
            ))}
        </ContentContainer>
    )
}