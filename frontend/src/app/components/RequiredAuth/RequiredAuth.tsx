import {Navigate, Outlet} from "react-router";
import {useUser} from "../../../features/auth/hooks/useUser.ts";
import {OverlayLoading} from "../../../common/components/ui/OverlayLoading/OverlayLoading.tsx";
import {PATHS, RouteKey} from "../../../common/router/routes.ts";

export const RequiredAuth = () => {
    const {
        isLoading,
        isAuthenticated,
    } = useUser();

    if (isLoading) {
        return (
            <OverlayLoading />
        )
    }

    if (!isAuthenticated) {
        return <Navigate to={PATHS[RouteKey.LOGIN]} replace />;
    }

    return <Outlet />;
}