import {RouteObject} from "react-router";
import {InventoryReportPage} from "./pages/InventoryReportPage/InventoryReportPage.tsx";
import {InvoiceReportPage} from "./pages/InvoiceReportPage/InvoiceReportPage.tsx";
import {PATHS, RouteKey} from "../../app/routes/path.ts";

export const reportsRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.INVENTORY_REPORT],
        element: <InventoryReportPage />
    },
    {
        path: PATHS[RouteKey.INVOICE_REPORT],
        element: <InvoiceReportPage />
    }
];