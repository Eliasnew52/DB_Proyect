import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {MRT_ColumnDef} from "material-react-table";
import {Brand} from "../../../../../common/domain/products/brands.types.ts";

export const BrandTableColumns: MRT_ColumnDef<Brand>[] = [
        {
            accessorKey: 'id',
            header: 'Id',
            enableEditing: false,
            size: 80,
        },
        {
            accessorKey: 'image',
            header: 'Imagen',
            Cell: ({ row }) => (
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
            accessorKey: 'last_updated',
            header: 'Última actualización',
        },
        {
            accessorKey: 'created_by',
            header: 'Creado por',
        },
        {
            accessorKey: 'creation_date',
            header: 'Creado en',
        },
        {
            accessorKey: 'active',
            header: 'Activo',
            Cell: ({ renderedCellValue }) => (
                renderedCellValue ?  <CheckCircleIcon color={'success'} /> : <DoDisturbOnIcon color={'error'} />
            )
        },
]