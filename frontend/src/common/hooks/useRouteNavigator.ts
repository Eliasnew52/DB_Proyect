import {NavigateOptions, useNavigate} from "react-router";
import {PATHS} from "../router/routes.ts";

export const useRouteNavigator = () => {
    const navigate = useNavigate();
    const go = (key: keyof typeof PATHS, opts?: NavigateOptions) =>
    navigate(PATHS[key], opts);
    return { go };
}