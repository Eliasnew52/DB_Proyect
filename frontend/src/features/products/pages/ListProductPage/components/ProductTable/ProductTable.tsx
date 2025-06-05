import {useMemo, useState} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {ProductTableColumns} from "./components/ProductTableColumns.tsx";
import {useProducts} from "../../../../../../common/hooks/useProducts.ts";

export const ProductTable = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { pageIndex, pageSize } = pagination;

    const { isPending: isLoadingProducts, isError: isLoadingProductsError, data: products , error } = useProducts(pageIndex + 1);
    console.log({ products: products?.results });

    const columns = useMemo(() => ProductTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: products?.results || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        manualPagination: true,
        enableStickyHeader: true,
        getRowId: (row) => String(row.id),
        initialState: {
            columnVisibility: { id: false, description: false }
        },
        muiToolbarAlertBannerProps: isLoadingProductsError
            ? {
                color: 'error',
                children: error.message,
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100dvh - 300px)',
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
        onPaginationChange: setPagination,
        state: {
            isLoading: isLoadingProducts,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingProductsError,
            showProgressBars: isLoadingProducts,
            pagination: pagination
        },
    });

    return <MaterialReactTable table={table} />;
}