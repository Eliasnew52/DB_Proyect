import React from "react";
import {NavLinkProps} from "react-router";
import {ListItemButtonProps} from "@mui/material";

export interface MenuItemLinkProps  {
    navLinkProps: NavLinkProps;
    listItemButtonProps?: Omit<ListItemButtonProps, "component" | "isactive">;
    children: React.ReactNode;
}

export interface StyledListItemButtonProps {
    isactive: number;
}