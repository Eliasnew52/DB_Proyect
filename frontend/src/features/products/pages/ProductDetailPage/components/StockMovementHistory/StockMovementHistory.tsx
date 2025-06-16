import {Grid} from "@mui/material";
import {StockMovementHistoryTable} from "./components/StockMovementHistoryTable/StockMovementHistoryTable.tsx";

export const StockMovementHistory = ({ productId }: { productId: number }) => {
    return (
        <Grid>
            <StockMovementHistoryTable productId={productId} />
        </Grid>
    )
}