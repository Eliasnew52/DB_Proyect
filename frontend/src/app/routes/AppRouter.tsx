import {Routes, Route} from "react-router";
import {authRoutes} from "../../features/auth/routes.tsx";
import {dashboardRoutes} from "../../features/dashboard/routes.tsx";
import {AuthLayout} from "../../features/auth/components/layout/AuthLayout/AuthLayout.tsx";
import {productsRoutes} from "../../features/products/routes.tsx";
import {purchasesRoutes} from "../../features/purchases/routes.tsx";
import {salesRoutes} from "../../features/sales/routes.tsx";
import {customerRoutes} from "../../features/customers/routes.tsx";
import {MainLayout} from "../components/MainLayout/MainLayout.tsx";
import {reportsRoutes} from "../../features/reports/routes.tsx";
import {RequiredAuth} from "../components/RequiredAuth/RequiredAuth.tsx";

export const AppRouter = () => {

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                {authRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Route>
            <Route element={<RequiredAuth />}>
                <Route element={<MainLayout />}>
                {customerRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {dashboardRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {productsRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {purchasesRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {reportsRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {salesRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Route>
            </Route>
        </Routes>
    )
}