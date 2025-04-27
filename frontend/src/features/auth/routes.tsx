import {RouteObject} from "react-router";
import {lazy} from "react";

const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage.tsx'));

export const authRoutes: RouteObject[] = [
    { path: 'login', element: <LoginPage /> }
]