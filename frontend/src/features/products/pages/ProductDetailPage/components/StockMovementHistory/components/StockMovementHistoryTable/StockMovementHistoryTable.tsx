import {useMemo, useState} from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import {SectionHeader} from "../../../../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {Box} from "@mui/material";
import {StockMovementHistoryTableColumns} from "./components/StockMovementHistoryTableColumns.tsx";
import {useProductStockMovements} from "../../../../../../hooks/useProductStockMovements.ts";

export const StockMovementHistoryTable = ({ productId }: { productId: number }) => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { pageIndex } = pagination;

    const { data: stockMovements, isLoading: isLoadingStockMovements, isError: isLoadingStockMovementsError, error } = useProductStockMovements(productId, pageIndex + 1)

    const columns = useMemo(
        () => StockMovementHistoryTableColumns,
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: stockMovements?.results || [],
        enableStickyHeader: true,
        renderTopToolbar: () => (
            <Box
                sx={{
                    paddingY: 3,
                    paddingX: 3
                }}
            >
                <SectionHeader
                    title={'Historial de Movimiento de Stock'}
                    Icon={MonitorHeartOutlinedIcon}
                />
            </Box>
        ),
        muiToolbarAlertBannerProps: isLoadingStockMovementsError
            ? {
                color: 'error',
                children: error.message,
            }
            : undefined,
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: '1px solid',
                borderColor: 'grey.300',
            }
},
        onPaginationChange: setPagination,
        state: {
            isLoading: isLoadingStockMovements,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingStockMovementsError,
            showProgressBars: isLoadingStockMovements,
            pagination: pagination
        },
    });

    return <MaterialReactTable table={table} />;
};