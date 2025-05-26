import { MRT_ColumnDef } from 'material-react-table'
import {SupplierWithBrands} from "../../../../../../../common/types/supplier.types.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

export const ProviderTableColumns: MRT_ColumnDef<SupplierWithBrands>[] = [
    {
        header: 'ID',
        accessorKey: 'id',
    },
    {
        header: 'Nombre de proveedor',
        accessorKey: 'name',
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
        header: 'Marcas',
        accessorFn: row => row.brands.map(b => b.name).join(', '),
        id: 'brands',
    },
    {
        header: 'Última actualización',
        accessorKey: 'last_updated',
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
        accessorKey: 'active',
        header: 'Activo',
        Cell: ({ renderedCellValue, row }) => (
            renderedCellValue ?  <CheckCircleIcon color={'success'} /> : <DoDisturbOnIcon color={'error'} />
        )
    },
    {
        header: 'Compañía',
        accessorKey: 'company',
    },
    {
        header: 'Creado por',
        accessorKey: 'created_by',
    },
    {
        accessorKey: 'creation_date',
        header: 'Creado en',
    },
]
