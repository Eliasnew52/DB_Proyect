import React from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Tab, { tabClasses } from "@mui/material/Tab";
import Tabs, { tabsClasses, TabsProps } from "@mui/material/Tabs";
import {DescriptionTabPanel} from "./DescriptionTabPanel.tsx";
import type {Product} from "../../../../../../../../common/types/products.types.ts";
import {AttributesTabPanel} from "./AttributesTabPanel.tsx";
import {SuppliersTabPanel} from "./SuppliersTabPanel.tsx";
import {DetailsTabPanel} from "./DetailsTabPanel.tsx";
import {Box, Grid} from "@mui/material";
import {DimensionsTabPanel} from "./DimensionsTabPanel.tsx";

const tabsStyles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.grey["200"],
        borderRadius: 2,
        minHeight: 44,
    },
    flexContainer: {
        position: "relative",
        padding: "0 3px",
        zIndex: 1,
    },
    indicator: {
        top: 3,
        bottom: 3,
        right: 3,
        height: "auto",
        borderRadius: "6px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px 0 rgba(0,0,0,0.16)",
    },
});

const tabItemStyles = (theme: Theme) => ({
    root: {
        fontWeight: 500,
        minHeight: 44,
        minWidth: 96,
        opacity: 0.7,
        color: (theme.vars || theme).palette.text.primary,
        textTransform: "initial",
        "&:hover": {
            opacity: 1,
        },
        [`&.${tabClasses.selected}`]: {
            color: (theme.vars || theme).palette.text.primary,
            opacity: 1,
        },
        [theme.breakpoints.up("md")]: {
            minWidth: 120,
        },
    },
});

function toSx<ClassKey extends string>(
    styles: (theme: Theme) => Partial<Record<ClassKey, any>>,
    classes: Record<ClassKey, string>
) {
    return function sxCallback(theme: Theme) {
        let sx = {};
        Object.entries<any>(styles(theme)).forEach(([key, value]) => {
            if (key === "root") {
                sx = { ...sx, ...value };
            } else {
                sx[`& .${classes[key]}`] = value;
            }
        });
        return sx;
    } as SxProps<Theme>;
}

interface ProductTabs extends TabsProps {
    product?: Product;
}

export const ProductTabs = ({ product, sx }: ProductTabs) => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const tabItemSx = toSx(tabItemStyles, tabClasses);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Tabs
                value={tabIndex}
                onChange={(e, index) => setTabIndex(index)}
                sx={[toSx(tabsStyles, tabsClasses), ...(Array.isArray(sx) ? sx : [sx])]}
            >
                <Tab disableRipple label={"Descripción"} sx={tabItemSx} />
                <Tab disableRipple label={"Características"} sx={tabItemSx} />
                <Tab disableRipple label={"Dimensiones"} sx={tabItemSx} />
                <Tab disableRipple label={"Proveedores"} sx={tabItemSx} />
                <Tab disableRipple label={"Detalles"} sx={tabItemSx} />
            </Tabs>

            <>
                {
                    tabIndex === 0 && (
                        <DescriptionTabPanel product={product}  />
                    )
                }

                {
                    tabIndex === 1 && (
                        <AttributesTabPanel product={product} />
                    )
                }

                {
                    tabIndex === 2 && (
                        <DimensionsTabPanel measurements={product?.measurements} />
                    )
                }

                {
                    tabIndex === 3 && (
                        <SuppliersTabPanel suppliers={product?.suppliers} />
                    )
                }

                {
                    tabIndex === 4 && (
                        <DetailsTabPanel
                            createdAt={product?.creation_date}
                            lastUpdatedAt={product?.last_updated}
                            createdBy={product?.created_by?.username}
                        />
                    )
                }
            </>
        </Box>
    );
}