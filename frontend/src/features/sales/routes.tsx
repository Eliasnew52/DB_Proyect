import {RouteObject} from "react-router";
import {CreateSalePage} from "./pages/CreateSalePage/CreateSalePage.tsx";
import {ListSalePage} from "./pages/ListSalePage/ListSalePage.tsx";
import {PATHS, RouteKey} from "../../app/routes/path.ts";

export const salesRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.NEW_SALE],
        element: <CreateSalePage />
    },
    {
        path: PATHS[RouteKey.SALE_LIST],
        element: <ListSalePage />
    }
];