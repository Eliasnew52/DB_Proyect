import { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { PurchaseTableColumns } from "./components/PurchaseTableColumns";
import { usePurchases } from "../../../../../../common/hooks/purchases/usePurchases.ts";

export const PurchaseTable = () => {
    const { isPending: isLoadingPurchases, isError: isLoadingPurchasesError, data: purchases, error } = usePurchases();

    const columns = useMemo(() => PurchaseTableColumns, []);

    const table = useMaterialReactTable({
        columns,
        data: purchases || [],
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingPurchasesError
            ? {
                color: 'error',
                children: error?.message,
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 325px)',
                height: '100%',
            },
        },
        localization: MRT_Localization_ES,
        state: {
            isLoading: isLoadingPurchases,
            showAlertBanner: isLoadingPurchasesError,
            showProgressBars: isLoadingPurchases,
        },
    });

    return <MaterialReactTable table={table} />;
};