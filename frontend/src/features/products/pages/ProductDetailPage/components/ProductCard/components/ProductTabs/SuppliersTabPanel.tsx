import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import {Grid, Typography} from "@mui/material";
import type {SupplierMini} from "../../../../../../../../common/types/suppliers.types.ts";

export const SuppliersTabPanel = ({ suppliers }: { suppliers?: SupplierMini[] }) => {

    return (
        <ContentContainer>
            {
                suppliers && suppliers.map((supplier) => (
                    <Grid
                        key={supplier.id}
                        container
                        alignItems="center"
                        spacing={1}
                    >
                        <Inventory2OutlinedIcon fontSize={'small'} />

                        <Typography>
                            { supplier.name }
                        </Typography>
                    </Grid>
                ))
            }
        </ContentContainer>
    )
}