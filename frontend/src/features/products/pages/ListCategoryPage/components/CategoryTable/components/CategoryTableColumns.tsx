import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

export const CategoryTableColumns = [
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
                alt={`${row.original.name} category image`}
                height={30}
                src={row.original.image}
                loading="lazy"
            />
        ),
    },
    {
        accessorKey: 'name',
        header: 'Nombre de categoría',
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
    {
        accessorKey: 'active',
        header: 'Activo',
        Cell: ({ renderedCellValue, row }) => (
            renderedCellValue ?  <CheckCircleIcon color={'success'} /> : <DoDisturbOnIcon color={'error'} />
        )
    },
]