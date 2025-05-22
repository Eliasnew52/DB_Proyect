import {SimpleMenuItem} from "../SimpleMenuItem/SimpleMenuItem.tsx";
import {CollapsableMenuItem} from "../CollapsableMenuItem/CollapsableMenuItem.tsx";
import type {DrawerMenuItemProps} from "./DrawerMenuItem.types.ts";

export const DrawerMenuItem = ({ label, icon, subRoutes, path }: DrawerMenuItemProps) => {
    if (subRoutes.length > 0) {
        return <CollapsableMenuItem label={label} icon={icon} subRoutes={subRoutes} />;
    } else {
        return <SimpleMenuItem label={label} icon={icon} path={path} />;
    }
}