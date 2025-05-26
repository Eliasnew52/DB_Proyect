import {RouteObject} from "react-router";
import {CreateClientPage} from "./pages/CreateClientPage/CreateClientPage.tsx";
import {ListClientPage} from "./pages/ListClientPage/ListClientPage.tsx";
import {PATHS, RouteKey} from "../../common/router/routes.ts";

export const clientsRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.NEW_CLIENT],
        element: <CreateClientPage />
    },
    {
        path: PATHS[RouteKey.CLIENT_LIST],
        element: <ListClientPage />
    }
];