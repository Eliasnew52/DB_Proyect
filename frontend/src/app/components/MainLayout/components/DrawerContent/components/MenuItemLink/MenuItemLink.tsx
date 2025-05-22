import {forwardRef} from "react";
import {NavLink} from "react-router";
import {ListItemButton, styled} from "@mui/material";
import type {MenuItemLinkProps, StyledListItemButtonProps} from "./MenuItemLink.types.ts";

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'isactive',
})<StyledListItemButtonProps>(({ theme, isactive}) => ({
    backgroundColor: isactive ? theme.palette.primary.light : 'transparent',
    width: '100%',
    gap: 10,
}));

export const MenuItemLink = forwardRef<HTMLAnchorElement, MenuItemLinkProps>(({ navLinkProps, listItemButtonProps, children }, ref) => {
    return (
        <NavLink
            ref={ref}
            {...navLinkProps}
        >
            {({ isActive }) => (
                <StyledListItemButton
                    isactive={isActive ? 1 : 0}
                    {...listItemButtonProps}
                >
                    {children}
                </StyledListItemButton>
            )}
        </NavLink>
    );
});