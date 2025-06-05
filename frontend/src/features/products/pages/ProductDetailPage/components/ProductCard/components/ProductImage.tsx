import {Grid} from "@mui/material";
import placeholderImg from '../../../../../../../assets/placeholder.svg'

export const ProductImage = ({ image, alt }: { image?: string, alt?: string }) => {
    return (
        <Grid
            container
            size={4}
        >
            <img
                src={image ?? placeholderImg}
                alt={`${alt ?? 'Product'} image`}
                width={'100%'}
                style={{
                    objectFit: 'contain',
                    height: '560px'
                }}
            />
        </Grid>
    )
}