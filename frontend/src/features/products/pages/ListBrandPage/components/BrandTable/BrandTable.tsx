import {useMemo} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {useBrands} from "../../../../../../common/hooks/products/useBrands.ts";
import {BrandTableColumns} from "../BrandTableColumns.tsx";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {UpdateBrandDialog} from "./components/UpdateBrandDialog.tsx";
import {Button} from "@mui/material";
import {CreateBrandDialog} from "./components/CreateBrandDialog.tsx";

export const BrandTable = () => {
    const { isPending: isLoadingBrands, isError: isLoadingBrandsError, data: brands , error } = useBrands();

    const columns = useMemo(() => BrandTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: brands || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingBrandsError
            ? {
                color: 'error',
                children: error.message,
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100dhv - 325px)',
                height: '100%',
            },
        },
        // muiTableBodyRowProps: ({ row }) => ({
        //     sx: !row.original.active
        //         ? {
        //             backgroundColor: '#D3D3D3',
        //         }
        //         : {},
        // }),
        localization: MRT_Localization_ES,
        renderCreateRowDialogContent: ({ row, table }) => (
            <CreateBrandDialog row={row} table={table} />
        ),
        renderEditRowDialogContent: ({ row, table }) => (
            <UpdateBrandDialog row={row} table={table} />
        ),
        // renderRowActions: ({row, table}) => (
        //     <BrandTableRowActions row={row} table={table} />
        // ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Crear marca
            </Button>
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