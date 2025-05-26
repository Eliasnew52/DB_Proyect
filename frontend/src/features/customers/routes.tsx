import {RouteObject} from "react-router";
import {CreateClientPage} from "./pages/CreateCustomerPage/CreateClientPage.tsx";
import {ListCustomerPage} from "./pages/ListCustomerPage/ListCustomerPage.tsx";
import {PATHS, RouteKey} from "../../common/router/routes.ts";

export const customerRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.NEW_CLIENT],
        element: <CreateClientPage />
    },
    {
        path: PATHS[RouteKey.CLIENT_LIST],
        element: <ListCustomerPage />
    }
];