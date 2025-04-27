import {RouteObject} from "react-router";
import {CreateProviderPage} from "./pages/CreateProviderPage/CreateProviderPage.tsx";
import {ListProviderPage} from "./pages/ListProviderPage/ListProviderPage.tsx";

export const providersRoutes: RouteObject[] = [
    { path: '/new-provider', element: <CreateProviderPage /> },
    { path: '/provider-list', element: <ListProviderPage /> },
]