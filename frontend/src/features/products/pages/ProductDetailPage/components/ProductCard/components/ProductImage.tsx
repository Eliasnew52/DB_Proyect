import {Grid} from "@mui/material";
import placeholderImg from '../../../../../../../assets/placeholder.svg'

export const ProductImage = ({ image, alt }: { image?: string, alt?: string }) => {
    return (
        <Grid
            container
            size={4}
            border={'1px solid'}
            borderColor={'grey.300'}
            borderRadius={2}
        >
            <img
                src={image ?? placeholderImg}
                alt={`${alt ?? 'Product'} image`}
                width={'100%'}
                style={{
                    objectFit: 'contain',
                    height: '558px'
                }}
            />
        </Grid>
    )
}