import {RouteObject} from "react-router";
import {CreatePurchasePage} from "./CreatePurchasePage/CreatePurchasePage.tsx";
import {ListPurchasePage} from "./ListPurchasePage/ListPurchasePage.tsx";

export const purchasesRoutes: RouteObject[] = [
    { path: '/new-purchase', element: <CreatePurchasePage /> },
    { path: '/purchase-list', element: <ListPurchasePage /> },
]