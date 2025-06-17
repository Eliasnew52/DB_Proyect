import type {MRT_ColumnDef} from "material-react-table";
import type {StockMovement} from "../../../../../../../../../common/domain/inventory/stockMovements.types.ts";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {Grid, Typography} from "@mui/material";

export const StockMovementHistoryTableColumns: MRT_ColumnDef<StockMovement>[] = [
    {
        accessorKey: 'creation_date',
        header: 'Fecha',
        size: 150,
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.creation_date),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString()
    },
    {
        accessorKey: 'product.name',
        header: 'Producto',
        size: 150,
    },
    {
        accessorKey: 'movement_type.label',
        header: 'Tipo',
        size: 150,
        Cell: ({row}) => (
            <Grid
                container
                alignItems={'center'}
                spacing={1}
            >
                {
                    row.original.movement_type.code === 'OUT' ? (
                        <TrendingDownIcon color={'error'}/>
                    ) : (
                        <TrendingUpIcon color={'success'}/>
                    )
                }
                {row.original.movement_type.label}
            </Grid>
        )
    },
    {
        accessorKey: 'quantity',
        header: 'Cantidad',
        size: 200,
        accessorFn: (row) => {
            const { movement_type, quantity } = row;

            return (
                <Typography
                    fontWeight={600}
                    color={movement_type.code === 'OUT' ? 'error' : 'success'}
                >
                    {movement_type.code === 'OUT' ? '-' : '+'}
                    {quantity}
                </Typography>
            )
        },
    },
    {
        accessorKey: 'reason',
        header: 'Razón',
        size: 150,
    },
    {
        accessorKey: 'created_by.username',
        header: 'Creado por',
        size: 150,
    },
    {
        accessorKey: 'product.stock',
        header: 'Stock',
        size: 150,
    }
]