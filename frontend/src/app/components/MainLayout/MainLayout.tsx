import React from "react";
import {Outlet} from "react-router";
import {UserMenu} from "../../../../features/dashboard/components/UserMenu.tsx";
import {DrawerContent} from "./components/DrawerContent/DrawerContent.tsx";
import type {MenuOption} from "./MainLayout.types.ts";
import {dashboardRoutes} from "../../../../features/dashboard/routes.tsx";
import {productsRoutes} from "../../../../features/products/routes.tsx";
import {purchasesRoutes} from "../../../../features/purchases/routes.tsx";
import {salesRoutes} from "../../../../features/sales/routes.tsx";
import {providersRoutes} from "../../../../features/providers/routes.tsx";
import {clientsRoutes} from "../../../../features/clients/routes.tsx";
import {reportsRoutes} from "../../../../features/reports/routes.tsx";
import {
    AppBar,
    Box,
    Drawer,
    Grid,
    IconButton,
    Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';


const drawerWidth = 240;
const menuOptions: MenuOption[] = [
    {label: 'Panel', icon: <SpeedOutlinedIcon fontSize="small" />, path: dashboardRoutes[0].path, subRoutes: []},
    {
        label: 'Productos',
        icon: <Inventory2OutlinedIcon fontSize="small" />,
        subRoutes: [
            {
                path: productsRoutes[1].path ?? '',
                label: 'Crear categoría',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: productsRoutes[0].path ?? '',
                label: 'Crear producto',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: productsRoutes[2].path ?? '',
                label: 'Crear marca',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: productsRoutes[3].path ?? '',
                label: 'Listar productos',
                icon: <ListAltIcon fontSize="small" />
            },
            {
                path: productsRoutes[4].path ?? '',
                label: 'Listar categorías',
                icon: <ListAltIcon fontSize="small" />
            },
            {
                path: productsRoutes[5].path ?? '',
                label: 'Listar marcas',
                icon: <ListAltIcon fontSize="small" />
            },
        ]
    },
    {
        label: 'Ventas',
        icon: <ShoppingCartOutlinedIcon fontSize="small"/>,
        subRoutes: [
            {
                path: salesRoutes[0].path ?? '',
                label: 'Crear venta',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: salesRoutes[1].path ?? '',
                label: 'Listar ventas',
                icon: <ListAltIcon fontSize="small" />
            },
        ]
    },
    {
        label: 'Compras',
        icon: <ReceiptLongOutlinedIcon fontSize="small"/>,
        subRoutes: [
            {
                path: purchasesRoutes[0].path ?? '',
                label: 'Crear compra',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: purchasesRoutes[1].path ?? '',
                label: 'Listar compras',
                icon: <ListAltIcon fontSize="small" />
            },
        ]
    },
    {
        label: 'Proveedores',
        icon: <LocalShippingOutlinedIcon fontSize="small"/>,
        subRoutes: [
            {
                path: providersRoutes[0].path ?? '',
                label: 'Crear proveedor',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: providersRoutes[1].path ?? '',
                label: 'Listar proveedores',
                icon: <ListAltIcon fontSize="small" />
            },
        ]
    },
    {
        label: 'Clientes',
        icon: <PermIdentityOutlinedIcon fontSize="small"/>,
        subRoutes: [
            {
                path: clientsRoutes[0].path ?? '',
                label: 'Crear cliente',
                icon: <AddCircleOutlineIcon fontSize="small" />
            },
            {
                path: clientsRoutes[1].path ?? '',
                label: 'Listar clientes',
                icon: <ListAltIcon fontSize="small" />
            },
        ]
    },
    {
        label: 'Reportes',
        icon: <AssessmentOutlinedIcon fontSize="small"/>,
        subRoutes: [
            {
                path: reportsRoutes[0].path ?? '',
                label: 'Reporte de inventario',
                icon: <InsertChartOutlinedIcon fontSize="small" />
            },
            {
                path: reportsRoutes[1].path ?? '',
                label: 'Reporte de facturas',
                icon: <InsertChartOutlinedIcon fontSize="small" />
            },
        ]
    },
]

export const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <Box sx={{display: 'flex'}}>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Grid
                        container
                        marginLeft={'auto'}
                    >
                        <UserMenu/>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    {<DrawerContent menuOptions={menuOptions} />}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {<DrawerContent menuOptions={menuOptions} />}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
                <Outlet/>
            </Box>
        </Box>
    )
}