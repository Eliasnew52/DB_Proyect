import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {useBrands} from "../../../../hooks/useBrands.ts";
import {useMemo} from "react";
import {BrandTableColumns} from "../BrandTableColumns.tsx";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {UpdateBrandDialog} from "./components/UpdateBrandDialog.tsx";

export const BrandTable = () => {
    const { isPending: isLoadingBrands, isError: isLoadingBrandsError, data: brands , error } = useBrands();

    const columns = useMemo(() => BrandTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: brands || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingBrandsError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100dhv - 325px)',
                height: '100%',
            },
        },
        localization: MRT_Localization_ES,
        renderEditRowDialogContent: ({ row, table }) => (
            <UpdateBrandDialog row={row} table={table} />
        ),
        state: {
            isLoading: isLoadingBrands,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingBrandsError,
            showProgressBars: isLoadingBrands,
        },
    });

    return <MaterialReactTable table={table} />;
}