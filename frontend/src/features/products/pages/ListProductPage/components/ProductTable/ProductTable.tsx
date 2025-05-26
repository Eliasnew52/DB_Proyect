import {useMemo} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {ProductTableColumns} from "./components/ProductTableColumns.tsx";
import {useProducts} from "../../../../hooks/useProducts.ts";

export const ProductTable = () => {
    const { isPending: isLoadingProducts, isError: isLoadingProductsError, data: products , error } = useProducts();

    const columns = useMemo(() => ProductTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: products || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingProductsError
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
        // renderCreateRowDialogContent: ({ row, table }) => (
        //     <CreateBrandDialog row={row} table={table} />
        // ),
        // renderEditRowDialogContent: ({ row, table }) => (
        //     <UpdateBrandDialog row={row} table={table} />
        // ),
        // // renderRowActions: ({row, table}) => (
        // //     <BrandTableRowActions row={row} table={table} />
        // // ),
        // renderTopToolbarCustomActions: ({ table }) => (
        //     <Button
        //         variant="contained"
        //         onClick={() => {
        //             table.setCreatingRow(true);
        //         }}
        //     >
        //         Crear categoría
        //     </Button>
        // ),
        state: {
            isLoading: isLoadingProducts,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingProductsError,
            showProgressBars: isLoadingProducts,
        },
    });

    return <MaterialReactTable table={table} />;
}