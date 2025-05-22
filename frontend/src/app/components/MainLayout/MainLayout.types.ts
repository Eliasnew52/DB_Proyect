import React from "react";

interface MenuOptionRoutes {
    path: string;
    icon: React.ReactNode,
    label: string;
}

export type MenuOption = {
    label: string;
    icon: React.ReactNode;
    path?: string;
    subRoutes: MenuOptionRoutes[];
}