import {Navigate, Outlet} from "react-router";
import {useUser} from "../../../features/auth/hooks/useUser.ts";
import {OverlayLoading} from "../../../common/components/ui/OverlayLoading/OverlayLoading.tsx";

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
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}