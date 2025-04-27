import {RouteObject} from "react-router";
import {CreateProductPage} from "./pages/CreateProductPage/CreateProductPage.tsx";
import {CreateCategoryPage} from "./pages/CreateCategoryPage/CreateCategoryPage.tsx";
import {CreateBrandPage} from "./pages/CreateBrandPage/CreateBrandPage.tsx";
import {ListProductPage} from "./pages/ListProductPage/ListProductPage.tsx";
import {ListCategoryPage} from "./pages/ListCategoryPage/ListCategoryPage.tsx";
import {ListBrandPage} from "./pages/ListBrandPage/ListBrandPage.tsx";

export const productsRoutes: RouteObject[] = [
    { path: '/new-product', element: <CreateProductPage /> },
    { path: '/new-category', element: <CreateCategoryPage /> },
    { path: '/new-brand', element: <CreateBrandPage /> },
    { path: '/product-list', element: <ListProductPage /> },
    { path: '/category-list', element: <ListCategoryPage /> },
    { path: '/brand-list', element: <ListBrandPage /> },
]