import {Divider, List, Toolbar} from "@mui/material";
import type {DrawerContentProps} from "./DrawerContent.types.ts";
import {DrawerMenuItem} from "./components/DrawerMenuItem/DrawerMenuItem.tsx";

export const DrawerContent = ({ menuOptions }: DrawerContentProps) => {

    return (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                {menuOptions.map((option) => (
                    <DrawerMenuItem key={option.label} icon={option.icon} label={option.label} subRoutes={option.subRoutes} path={option.path} />
                ))}
            </List>
        </div>
    )
}