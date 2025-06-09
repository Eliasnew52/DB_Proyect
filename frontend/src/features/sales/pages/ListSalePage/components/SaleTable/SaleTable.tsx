import { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { SaleTableColumns } from "./components/SaleTableColumns";
import { useSales } from "../../../../../../common/hooks/sales/useSales.ts";

export const SaleTable = () => {
    const { isPending: isLoadingSales, isError: isLoadingSalesError, data: sales, error } = useSales();

    const columns = useMemo(() => SaleTableColumns, []);

    const table = useMaterialReactTable({
        columns,
        data: sales || [],
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingSalesError
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
            isLoading: isLoadingSales,
            showAlertBanner: isLoadingSalesError,
            showProgressBars: isLoadingSales,
        },
    });

    return <MaterialReactTable table={table} />;
};