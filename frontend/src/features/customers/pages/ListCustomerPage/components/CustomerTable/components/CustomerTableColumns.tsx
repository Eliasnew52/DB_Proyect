import { MRT_ColumnDef } from 'material-react-table';
import {Customer} from "../../../../../../../common/types/customer.types.ts";

export const CustomerTableColumns: MRT_ColumnDef<Customer>[] = [
    {
        header: 'ID',
        accessorKey: 'id',
    },
    {
        header: 'Nombre de cliente',
        accessorKey: 'name',
    },
    {
        header: 'Dirección',
        accessorKey: 'address',
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: 'Teléfono',
        accessorKey: 'phone',
    },
    {
        header: 'Creado en',
        accessorKey: 'creation_date',
        Cell: ({ cell }) => {
            const raw = cell.getValue<string>();
            return new Date(raw).toLocaleDateString();
        },
    },
    {
        header: 'Última actualización',
        accessorKey: 'last_updated',
        Cell: ({ cell }) => {
            const raw = cell.getValue<string>();
            return new Date(raw).toLocaleString();
        },
    },
    {
        header: 'Creado por',
        accessorKey: 'created_by',
    },
];
