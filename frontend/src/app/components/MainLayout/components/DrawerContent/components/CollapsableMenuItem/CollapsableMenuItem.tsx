import React from "react";
import {Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import type {CollapsableMenuItemProps} from "./CollapsableMenuItem.types.tsx";
import {MenuItemLink} from "../MenuItemLink/MenuItemLink.tsx";

export const CollapsableMenuItem = ({icon, label, subRoutes}: CollapsableMenuItemProps) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={handleClick} sx={{
                    gap: 1
                }}>
                        <ListItemIcon sx={{
                            minWidth: 0
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
                    {open ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {subRoutes.map((route) => (
                        <MenuItemLink
                            key={route.label}
                            navLinkProps={{
                                to: route.path,
                                style: {
                                    textDecoration: "none",
                                }
                            }}
                            listItemButtonProps={{
                                sx: { pl: 4 }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0
                                }}
                            >
                                {route.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={route.label}
                                slotProps={{
                                    primary: {
                                        sx: {
                                            fontSize: 14
                                        }
                                    }
                                }}
                            />
                        </MenuItemLink>
                    ))}
                </List>
            </Collapse>
        </>
    )
}