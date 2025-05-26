import {useMemo} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {useCustomers} from "../../../../hooks/useCustomers.ts";
import {CustomerTableColumns} from "./components/CustomerTableColumns.tsx";

export const CustomerTable = () => {
    const { isPending: isLoadingCustomers, isError: isLoadingCustomersError, data: customers , error } = useCustomers();

    const columns = useMemo(() => CustomerTableColumns, [])

    const table = useMaterialReactTable({
        columns,
        data: customers || [],
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => String(row.id),
        muiToolbarAlertBannerProps: isLoadingCustomersError
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
        state: {
            isLoading: isLoadingCustomers,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingCustomersError,
            showProgressBars: isLoadingCustomers,
        },
    });

    return <MaterialReactTable table={table} />;
}