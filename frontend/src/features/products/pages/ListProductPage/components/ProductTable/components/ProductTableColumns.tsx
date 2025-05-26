import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { MRT_ColumnDef } from 'material-react-table';
import { Product } from '../../../../../../../common/types/products.types.ts';

export const ProductTableColumns: MRT_ColumnDef<Product>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 60,
    },
    {
        accessorKey: 'image',
        header: 'Imagen',
        Cell: ({ row }) => (
            <img
                alt={row.original.name}
                src={row.original.image}
                height={30}
                loading="lazy"
            />
        ),
        size: 80,
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
    },
    {
        accessorKey: 'description',
        header: 'Descripción',
    },
    {
        accessorKey: 'category.name',
        header: 'Categoría',
    },
    {
        accessorKey: 'brand.name',
        header: 'Marca',
    },
    {
        accessorKey: 'sale_price',
        header: 'Precio venta',
    },
    {
        accessorKey: 'purchase_price',
        header: 'Precio compra',
    },
    {
        accessorKey: 'minimum_stock',
        header: 'Stock mínimo',
    },
    {
        accessorKey: 'stock',
        header: 'Stock actual',
    },
    {
        accessorKey: 'creation_date',
        header: 'Fecha creación',
    },
    {
        accessorKey: 'last_updated',
        header: 'Última actualización',
    },
    {
        accessorFn: (row: Product) =>
            row.suppliers.map(s => s.name).join(', '),
        id: 'suppliers',
        header: 'Proveedores',
    },
    {
        accessorFn: (row: Product) =>
            Object.entries(row.attributes || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join(' • '),
        id: 'attributes',
        header: 'Atributos',
    },
    {
        accessorKey: 'created_by',
        header: 'Creado por',
        Cell: ({ renderedCellValue }) => renderedCellValue ?? '—',
    },
    {
        accessorKey: 'active',
        header: 'Activo',
        Cell: ({ renderedCellValue }) =>
            renderedCellValue
                ? <CheckCircleIcon color="success" />
                : <DoDisturbOnIcon color="error" />,
        size: 60,
    },
];
