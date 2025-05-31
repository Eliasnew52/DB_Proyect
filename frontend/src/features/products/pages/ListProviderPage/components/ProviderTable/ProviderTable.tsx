import {useMemo} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {useProviders} from "../../../../../../common/hooks/useProviders.ts";
import {ProviderTableColumns} from "./components/ProviderTableColumns.tsx";

export const ProviderTable = () => {
    const { isPending: isLoadingProviders, isError: isLoadingProvidersError, data: suppliers , error } = useProviders();

    const columns = useMemo(() => ProviderTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: suppliers || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingProvidersError
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
        //         Crear marca
        //     </Button>
        // ),
        state: {
            isLoading: isLoadingProviders,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingProvidersError,
            showProgressBars: isLoadingProviders,
        },
    });

    return <MaterialReactTable table={table} />;
}