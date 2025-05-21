export const BrandTableColumns = [
        {
            accessorKey: 'id',
            header: 'Id',
            enableEditing: false,
            size: 80,
        },
        {
            accessorKey: 'image',
            header: 'Imagen',
            Cell: ({ renderedCellValue, row }) => (
                <img
                    alt={`${row.original.name} brand image`}
                    height={30}
                    src={row.original.image}
                    loading="lazy"
                />
            ),
        },
        {
            accessorKey: 'name',
            header: 'Nombre de marca',
        },
        {
            accessorKey: 'description',
            header: 'Descripción',
        },
        {
            accessorKey: 'creation_date',
            header: 'Fecha de creación',
        },
        {
            accessorKey: 'last_updated',
            header: 'Última actualización',
        },
        {
            accessorKey: 'created_by',
            header: 'Creado por',
        },
]