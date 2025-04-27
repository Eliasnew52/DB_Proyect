import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import {MenuOption} from "../MainLayout.types.ts";

type DrawerContentProps = {
    menuOptions: MenuOption[];
}

export const DrawerContent = ({ menuOptions }: DrawerContentProps) => {
    return (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                {menuOptions.map((option) => (
                    <ListItem key={option.label} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {option.icon}
                            </ListItemIcon>
                            <ListItemText primary={option.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}