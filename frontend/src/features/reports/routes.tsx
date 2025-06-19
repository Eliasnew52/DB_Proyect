import {RouteObject} from "react-router";
import {InventoryReportPage} from "./pages/InventoryReportPage/InventoryReportPage.tsx";
import {InvoiceReportPage} from "./pages/InvoiceReportPage/InvoiceReportPage.tsx";
import {PATHS, RouteKey} from "../../common/router/routes.ts";
import {SalesByProductReportPage} from "./pages/SalesByProductReportPage/SalesByProductReportPage.tsx";

export const reportsRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.INVENTORY_REPORT],
        element: <InventoryReportPage />
    },
    {
        path: PATHS[RouteKey.INVOICE_REPORT],
        element: <InvoiceReportPage />
    },
    {
        path: PATHS[RouteKey.SALES_BY_PRODUCT_REPORT],
        element: <SalesByProductReportPage />
    }
];