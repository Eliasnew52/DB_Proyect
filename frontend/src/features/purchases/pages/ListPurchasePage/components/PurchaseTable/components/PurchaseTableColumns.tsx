import { MRT_ColumnDef } from 'material-react-table';
export const PurchaseTableColumns: MRT_ColumnDef<any>[] = [
    {
        accessorKey: 'date',
        header: 'Fecha',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString('es-NI'),
    },
    {
        accessorKey: 'supplier.name',
        header: 'Proveedor',
        Cell: ({ row }) => row.original.supplier?.name || '—',
    },
    {
        accessorKey: 'payment_method.name',
        header: 'Método de pago',
        Cell: ({ row }) => row.original.payment_method?.name || '—',
    },
    {
        accessorKey: 'status.label',
        header: 'Estado',
        Cell: ({ row }) => row.original.status?.label || row.original.status?.code || '—',
    },
    {
        accessorKey: 'total',
        header: 'Total',
        Cell: ({ cell }) => `${Number(cell.getValue()).toLocaleString('es-NI', {
            style: 'currency',
            currency: 'NIO',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`,
    },
    {
        accessorKey: 'details',
        header: 'Productos',
        Cell: ({ row }) =>
            Array.isArray(row.original.details)
                ? row.original.details.map(d => d.product?.name).join(', ')
                : '—',
    },
    {
        accessorKey: 'notes',
        header: 'Notas',
        Cell: ({ cell }) => cell.getValue() || '—',
    },
    {
        accessorKey: 'invoice_image',
        header: 'Factura',
        Cell: ({ cell }) =>
            cell.getValue()
                ? <img src={cell.getValue()} alt="Factura" style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }} />
                : '—',
    },
];