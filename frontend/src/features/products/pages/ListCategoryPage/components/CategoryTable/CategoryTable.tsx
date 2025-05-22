import {useMemo} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {useCategories} from "../../../../hooks/useCategories.ts";
import {CategoryTableColumns} from "./components/CategoryTableColumns.tsx";

export const CategoryTable = () => {
    const { isPending: isLoadingCategories, isError: isLoadingCategoriesError, data: categories , error } = useCategories();

    const columns = useMemo(() => CategoryTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: categories || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingCategoriesError
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
            isLoading: isLoadingCategories,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingCategoriesError,
            showProgressBars: isLoadingCategories,
        },
    });

    return <MaterialReactTable table={table} />;
}