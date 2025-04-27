import {RouteObject} from "react-router";
import {CreateSalePage} from "./pages/CreateSalePage/CreateSalePage.tsx";
import {ListSalePage} from "./pages/ListSalePage/ListSalePage.tsx";

export const salesRoutes: RouteObject[] = [
    { path: '/new-sale', element: <CreateSalePage /> },
    { path: '/sale-list', element: <ListSalePage /> },
]