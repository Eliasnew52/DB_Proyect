import {Grid} from "@mui/material";
import {ActivityLogTable} from "./components/ActivityLogTable/ActivityLogTable.tsx";

export const ActivityLog = ({ productId }: { productId: number }) => {
    return (
        <Grid>
            <ActivityLogTable productId={productId} />
        </Grid>
    )
}