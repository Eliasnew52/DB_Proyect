import {useQuery} from "@tanstack/react-query";
import {SALES_BY_PRODUCT_REPORT} from "./queryKeys.ts";
import {getSalesByProductReport} from "../api/fetchers/salesByProductReportFetchers.ts";

export const useSalesByProductReport = (page: number, pageSize: number) => {
    return useQuery({
        queryKey: SALES_BY_PRODUCT_REPORT,
        queryFn: ({ signal }) => getSalesByProductReport(page, pageSize, signal)
    });
}