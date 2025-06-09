import { MRT_ColumnDef } from 'material-react-table';
import {Chip, Grid, Typography} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { Product } from '../../../../../../../common/domain/products/products.types.ts';
import { formatDate } from '../../../../../../../common/utils/formatDate.ts';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

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
        Cell: ({ renderedCellValue }) => (
            <Typography fontSize={13} fontWeight={500}>
                {renderedCellValue}
            </Typography>
        )
    },
    {
        id: 'stock_status',
        header: 'Estado',
        Cell: ({ row }) => {
            const { stock, minimum_stock } = row.original;
            const needsRestock = stock <= minimum_stock;

            return (
                <Chip
                    color={needsRestock ? 'error' : 'success'}
                    sx={{
                        color: 'primary.contrastText',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}
                    label={
                        <Grid
                            container
                            alignItems={'center'}
                            spacing={1}
                        >
                            {
                                needsRestock ? (
                                    <WarningAmberOutlinedIcon
                                        color={'inherit'}
                                        fontSize={'inherit'}
                                    />
                                ) : (
                                    <Inventory2OutlinedIcon
                                        color={'inherit'}
                                        fontSize={'inherit'}
                                    />
                                )
                            }
                            <Typography
                                fontWeight={'bold'}
                                fontSize={'inherit'}
                            >
                                { needsRestock ? 'Rebastecer' : 'En stock' }
                            </Typography>
                        </Grid>
                    }
                />
            )
        }
    },
    {
        accessorKey: 'minimum_stock',
        header: 'Stock mínimo',
    },
    {
        accessorKey: 'stock',
        header: 'Stock actual',
        Cell: ({ renderedCellValue, row  }) => {
            const { stock, minimum_stock } = row.original;
            const needsRestock = stock <= minimum_stock;

            return (
                <Grid
                    container
                    spacing={1}
                    alignItems={'center'}
                >
                    {
                        needsRestock && (
                            <WarningAmberOutlinedIcon color={'error'} />
                        )
                    }
                    <Typography fontSize={14} fontWeight={600} color={needsRestock ? 'error' : 'text.primary'}>
                        { renderedCellValue }
                    </Typography>
                </Grid>
            )
        }
    },
    {
        accessorKey: 'description',
        header: 'Descripción',
    },
    {
        accessorKey: 'sale_price',
        header: 'Precio venta',
        accessorFn: (row) => row.sale_price.toLocaleString('es-NI', {
            style: 'currency',
            currency: 'NIO',
        }),
        Cell: ({ renderedCellValue }) => (
            <Typography fontSize={14} fontWeight={500}>
                {renderedCellValue}
            </Typography>
        )
    },
    {
        accessorKey: 'purchase_price',
        header: 'Precio compra',
        accessorFn: (row) => row.purchase_price.toLocaleString('es-NI', {
            style: 'currency',
            currency: 'NIO',
        }),
        Cell: ({ renderedCellValue }) => (
            <Typography fontSize={14} fontWeight={500}>
                {renderedCellValue}
            </Typography>
        )
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
        accessorKey: 'creation_date',
        header: 'Fecha creación',
        accessorFn: (row) => formatDate(row.creation_date),
    },
    {
        accessorKey: 'last_updated',
        header: 'Última actualización',
        accessorFn: (row) => formatDate(row.last_updated),
    },
    {
        accessorFn: (row) =>
            row.suppliers.map(s => s.name).join(', '),
        id: 'suppliers',
        header: 'Proveedores',
    },
    // {
    //     accessorFn: (row: Product) =>
    //         Object.entries(row.attributes || {})
    //             .map(([key, value]) => `${key}: ${value}`)
    //             .join(' • '),
    //     id: 'attributes',
    //     header: 'Atributos',
    // },
    {
        accessorKey: 'created_by',
        header: 'Creado por',
        accessorFn: (row) => row.created_by?.username ?? '—'
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
