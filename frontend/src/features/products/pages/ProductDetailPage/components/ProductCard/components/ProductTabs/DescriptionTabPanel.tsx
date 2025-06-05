import {Product} from "../../../../../../../../common/types/products.types.ts";
import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Typography} from "@mui/material";

export const DescriptionTabPanel = ({ product }: { product?: Product }) => {

    return (
        <ContentContainer>
            <Typography>
                { product?.description }
            </Typography>
        </ContentContainer>
    )
}
