import {useMemo, useState} from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {SectionHeader} from "../../../../../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import {Box} from "@mui/material";
import {useProductActivityLog} from "../../../../../../hooks/useProductActivityLog.ts";
import {ActivityLogTableColumns} from "./components/ActivityLogTableColumns.tsx";

export const ActivityLogTable = ({ productId }: { productId: number }) => {
    const [pagination , setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { pageIndex } = pagination;

    const { data: productActivityLog, isLoading: isLoadingProductActivityLog, isError: isLoadingProductActivityLogError, error } = useProductActivityLog(productId, pageIndex + 1)

    const columns = useMemo(
        () => ActivityLogTableColumns,
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: productActivityLog?.results || [],
        enableStickyHeader: true,
        renderTopToolbar: () => (
            <Box
                sx={{
                    paddingY: 3,
                    paddingX: 3
                }}
            >
                <SectionHeader
                    title={'Registro de Actividad del Producto'}
                    Icon={Inventory2OutlinedIcon}
                />
            </Box>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: '1px solid',
                borderColor: 'grey.300',
            }
        },
        muiToolbarAlertBannerProps: isLoadingProductActivityLogError
            ? {
                color: 'error',
                children: error.message,
            }
            : undefined,
        onPaginationChange: setPagination,
        state: {
            isLoading: isLoadingProductActivityLog,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingProductActivityLogError,
            showProgressBars: isLoadingProductActivityLog,
            pagination: pagination
        }
    });

    return <MaterialReactTable table={table} />;
};