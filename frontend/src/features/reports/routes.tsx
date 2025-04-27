import {RouteObject} from "react-router";
import {InventoryReportPage} from "./pages/InventoryReportPage/InventoryReportPage.tsx";
import {InvoiceReportPage} from "./pages/InvoiceReportPage/InvoiceReportPage.tsx";

export const reportsRoutes: RouteObject[] = [
    { path: '/inventory-report', element: <InventoryReportPage /> },
    { path: '/invoice-report', element: <InvoiceReportPage /> },
]