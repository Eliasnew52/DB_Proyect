import {RouteObject} from "react-router";
import {lazy} from "react";
import {PATHS, RouteKey} from "../../app/routes/path.ts";

const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage.tsx'));

export const authRoutes: RouteObject[] = [
    {
        path: PATHS[RouteKey.LOGIN],
        element: <LoginPage />
    }
];