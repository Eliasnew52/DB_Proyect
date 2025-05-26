import {RouteObject} from "react-router";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";
import {PATHS, RouteKey} from "../../common/router/routes.ts";

export const dashboardRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.DASHBOARD],
        element: <DashboardPage />
    }
];