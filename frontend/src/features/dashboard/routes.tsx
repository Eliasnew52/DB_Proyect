import {RouteObject} from "react-router";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";

export const dashboardRoutes: RouteObject[] = [
    { path: '/', element: <DashboardPage /> },
]