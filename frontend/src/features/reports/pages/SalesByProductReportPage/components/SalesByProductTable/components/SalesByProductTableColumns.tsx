import {MRT_ColumnDef} from "material-react-table";
import {Result} from "../../../../../domain/SalesByProductReport.ts";
import {formatPrice} from "../../../../../../../common/utils/formatPrice.ts";
import {Chip} from "@mui/material";

export const SalesByProductTableColumns: MRT_ColumnDef<Result>[] = [
    {
        accessorKey: 'product',
        header: 'Producto',
        size: 60,
    },
    {
        accessorKey: 'quantity_sold',
        header: 'Cantidad vendida',
        size: 60,
    },
    {
        accessorKey: 'net_revenue',
        header: 'Ingresos netos',
        size: 60,
        accessorFn: (row) => formatPrice(row.net_revenue)
    },
    {
        accessorKey: 'total_cost',
        header: 'Costo total',
        size: 60,
        accessorFn: (row) => formatPrice(row.total_cost)
    },
    {
        accessorKey: 'total_margin',
        header: 'Margen Total',
        size: 60,
        Cell: ({ row }) => {
            const { net_revenue, total_cost, total_margin } = row.original;
            const netProfit = net_revenue - total_cost;

            const profitColor = netProfit > 0
                ? 'success'
                : netProfit < 0
                    ? 'error'
                    : 'warning';

            return (
                <Chip
                    size="small"
                    color={profitColor}
                    label={formatPrice(total_margin)}
                />
            )
        }
    },
    {
        accessorKey: 'margin_pct',
        header: 'Margen',
        size: 60,
        accessorFn: (row) => `${row.margin_pct}%`
    },
]