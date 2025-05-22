import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import type {SimpleMenuItemProps} from "./SimpleMenuItem.types.ts";
import {MenuItemLink} from "../MenuItemLink/MenuItemLink.tsx";

export const SimpleMenuItem = ({icon, label, path}: SimpleMenuItemProps) => {
    return (
        <ListItem disablePadding>
            <MenuItemLink
                navLinkProps={{
                    to: path ?? '',
                    style: {
                        textDecoration: "none", width: '100%'
                    }
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={label}
                    slotProps={{
                        primary: {
                            sx: {
                                fontSize: 14
                            }
                        }
                    }}
                />
            </MenuItemLink>
        </ListItem>
    )
}