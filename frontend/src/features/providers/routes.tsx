import {RouteObject} from "react-router";
import {CreateProviderPage} from "./pages/CreateProviderPage/CreateProviderPage.tsx";
import {ListProviderPage} from "./pages/ListProviderPage/ListProviderPage.tsx";
import {PATHS, RouteKey} from "../../common/router/routes.ts";

export const providersRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.NEW_PROVIDER],
        element: <CreateProviderPage />
    },
    {
        path: PATHS[RouteKey.PROVIDER_LIST],
        element: <ListProviderPage />
    }
];