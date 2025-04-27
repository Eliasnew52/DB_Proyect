import {Routes, Route} from "react-router";
import {authRoutes} from "../../features/auth/routes.tsx";
import {dashboardRoutes} from "../../features/dashboard/routes.tsx";
import {AuthLayout} from "../../features/auth/components/layout/AuthLayout/AuthLayout.tsx";
import {MainLayout} from "../../common/components/layout/MainLayout/MainLayout.tsx";
import {productsRoutes} from "../../features/products/routes.tsx";
import {purchasesRoutes} from "../../features/purchases/routes.tsx";
import {salesRoutes} from "../../features/sales/routes.tsx";
import {providersRoutes} from "../../features/providers/routes.tsx";
import {clientsRoutes} from "../../features/clients/routes.tsx";

export const AppRouter = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                {authRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Route>
            <Route element={<MainLayout />}>
                {dashboardRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {productsRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {purchasesRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {salesRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {providersRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {clientsRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Route>
        </Routes>
    )
}