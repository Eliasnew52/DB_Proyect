import {RouteObject} from "react-router";
import {CreateClientPage} from "./pages/CreateClientPage/CreateClientPage.tsx";
import {ListClientPage} from "./pages/ListClientPage/ListClientPage.tsx";

export const clientsRoutes: RouteObject[] = [
    { path: '/new-client', element: <CreateClientPage /> },
    { path: '/client-list', element: <ListClientPage /> },
]