import {RouteObject} from "react-router";
import {CreatePurchasePage} from "./CreatePurchasePage/CreatePurchasePage.tsx";
import {ListPurchasePage} from "./ListPurchasePage/ListPurchasePage.tsx";
import {PATHS, RouteKey} from "../../common/router/routes.ts";

export const purchasesRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.NEW_PURCHASE],
        element: <CreatePurchasePage />
    },
    {
        path: PATHS[RouteKey.PURCHASE_LIST],
        element: <ListPurchasePage />
    }
];