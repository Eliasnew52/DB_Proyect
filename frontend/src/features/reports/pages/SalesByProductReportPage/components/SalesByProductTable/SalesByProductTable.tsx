import {useMemo, useState} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {SalesByProductTableColumns} from "./components/SalesByProductTableColumns.tsx";
import {MRT_Localization_ES} from "material-react-table/locales/es";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useSalesByProductReport} from "../../../../hooks/useSalesByProductReport.ts";
import {formatPrice} from "../../../../../../common/utils/formatPrice.ts";
import {Grid, Typography} from "@mui/material";
import {SalesSummaryCards} from "../SalesSummaryCards/SalesSummaryCards.tsx";

export const SalesByProductTable = () => {

    const [pagination , setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { pageIndex, pageSize } = pagination;

    const { data: salesByProduct, isLoading, isError, error } = useSalesByProductReport(pageIndex + 1, pageSize);

    const columns = useMemo(() => {
        return SalesByProductTableColumns.map(col => {
            switch (col.accessorKey) {
                case "product":
                    return {
                        ...col,
                        Footer: () => (
                            <Typography fontWeight="bold">Total</Typography>
                        ),
                    };
                case "quantity_sold":
                    return {
                        ...col,
                        Footer: () => (
                            <Typography fontWeight="bold">
                                {salesByProduct?.totals?.quantity_sold ?? 0}
                            </Typography>
                        ),
                    };
                case "net_revenue":
                    return {
                        ...col,
                        Footer: () => (
                            <Typography fontWeight="bold">
                                {formatPrice(salesByProduct?.totals?.net_revenue ?? 0)}
                            </Typography>
                        ),
                    };
                case "total_cost":
                    return {
                        ...col,
                        Footer: () => (
                            <Typography fontWeight="bold">
                                {formatPrice(salesByProduct?.totals?.total_cost ?? 0)}
                            </Typography>
                        ),
                    };
                case "total_margin":
                    return {
                        ...col,
                        Footer: () => {
                            const totalMargin = salesByProduct?.totals?.total_margin ?? 0;
                            const color =
                                totalMargin > 0
                                    ? "success.main"
                                    : totalMargin < 0
                                        ? "error.main"
                                        : "text.primary";

                            return (
                                <Typography fontWeight="bold" sx={{ color }}>
                                    {formatPrice(totalMargin)}
                                </Typography>
                            );
                        },
                    };
                case "margin_pct":
                    return {
                        ...col,
                        Footer: () => (
                            <Typography fontWeight="bold">
                                {(salesByProduct?.totals?.margin_pct ?? 0).toFixed(1)}%
                            </Typography>
                        ),
                    };
                default:
                    return col;
            }
        });
    }, [salesByProduct]);


    const table = useMaterialReactTable({
        columns,
        data: salesByProduct?.results || [],
        enableStickyHeader: true,
        enableStickyFooter: true,
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: '1px solid',
                borderColor: 'grey.300',
            }
        },
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: error.message,
            }
            : undefined,
        muiTableFooterRowProps: {
            sx: {
                backgroundColor: 'grey.200'
            }
        },
        localization: MRT_Localization_ES,
        onPaginationChange: setPagination,
        state: {
            isLoading: isLoading,
            // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isError,
            showProgressBars: isLoading,
            pagination: pagination
        }
    });

    return (
        <Grid
            container
            flexDirection="column"
            spacing={2}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
            </LocalizationProvider>

            <SalesSummaryCards totals={salesByProduct?.totals} />
        </Grid>
    );
}