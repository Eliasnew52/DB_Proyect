export const SaleTableColumns = [
    {
        accessorKey: 'date',
        header: 'Fecha',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString('es-NI'),
    },
    {
        accessorKey: 'customer.name',
        header: 'Cliente',
        Cell: ({ row }) => row.original.customer?.name || '—',
    },
    {
        accessorKey: 'payment_method.name',
        header: 'Método de pago',
        Cell: ({ row }) => row.original.payment_method?.name || '—',
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        Cell: ({ row }) =>
            typeof row.original.status === 'object'
                ? row.original.status.label || row.original.status.code || '—'
                : row.original.status || '—',
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
        accessorKey: 'products',
        header: 'Productos',
        Cell: ({ row }) =>
            Array.isArray(row.original.products)
                ? row.original.products.map(p => p.name).join(', ')
                : String(row.original.products),
    },
    {
        accessorKey: 'created_by',
        header: 'Creado por',
        Cell: ({ row }) => row.original.created_by?.name || row.original.created_by || '—',
    },
];