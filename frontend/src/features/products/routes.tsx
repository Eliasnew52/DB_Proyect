import {RouteObject} from "react-router";
import {CreateProductPage} from "./pages/CreateProductPage/CreateProductPage.tsx";
import {CreateCategoryPage} from "./pages/CreateCategoryPage/CreateCategoryPage.tsx";
import {ListProductPage} from "./pages/ListProductPage/ListProductPage.tsx";
import {ListCategoryPage} from "./pages/ListCategoryPage/ListCategoryPage.tsx";
import {ListBrandPage} from "./pages/ListBrandPage/ListBrandPage.tsx";
import {PATHS, RouteKey} from "../../app/routes/path.ts";

export const productsRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.NEW_PRODUCT],
        element: <CreateProductPage />
    },
    {
        path: PATHS[RouteKey.NEW_CATEGORY],
        element: <CreateCategoryPage />
    },
    // {
    //     path: PATHS[RouteKey.NEW_BRAND],
    //     element: <CreateBrandPage />
    // },
    {
        path: PATHS[RouteKey.PRODUCT_LIST],
        element: <ListProductPage />
    },
    {
        path: PATHS[RouteKey.CATEGORY_LIST],
        element: <ListCategoryPage />
    },
    {
        path: PATHS[RouteKey.BRAND_LIST],
        element: <ListBrandPage />
    }
];