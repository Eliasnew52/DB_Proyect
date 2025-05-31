import React from "react";
import { styled } from "@mui/material/styles";
import Tab, { tabClasses } from "@mui/material/Tab";
import Tabs, { tabsClasses, TabsProps } from "@mui/material/Tabs";
import {Grid} from "@mui/material";
import {useCategories} from "../../../../../../../../common/hooks/useCategories.ts";
import {InlineLoading} from "../../../../../../../../common/components/ui/InlineLoading/InlineLoading.tsx";
import {CategoryFilterProps} from "./CategoryFilter.types.ts";

const TabItem = styled(Tab)(({ theme }) => ({
    opacity: 1,
    overflow: "initial",
    zIndex: 2,
    textTransform: "initial",
    color: (theme.vars || theme).palette.text.primary,
    backgroundColor: (theme.vars || theme).palette.background.default,
    transition: "0.2s",
    borderRadius: 6,
    borderColor: 'grey.300',
    minWidth: 100,
    "&:before": {
        transition: "0.2s",
    },

    [`& + .${tabClasses.selected}::before`]: {
        opacity: 0,
    },
    [`&:not(.${tabClasses.selected})`]: {
        border: '1px solid grey',
    },
    "&:hover": {
        [`&:not(.${tabClasses.selected})`]: {
            backgroundColor: "rgba(0 0 0 / 0.1)",
        },
        "&::before": {
            opacity: 0,
        },
        [`& + .${tabClasses.root}::before`]: {
            opacity: 0,
        },
    },
    [`&.${tabClasses.selected}`]: {
        backgroundColor: (theme.vars || theme).palette.primary.main,
        color: (theme.vars || theme).palette.common.white,
    },
    [`&.${tabClasses.selected} + .${tabClasses.root}`]: {
        zIndex: 1,
    },
    [`&.${tabClasses.selected} + .${tabClasses.root}::before`]: {
        opacity: 0,
    },
}));


export const CategoryFilter = ({ onClick }: CategoryFilterProps) => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const { isPending: isLoadingCategories, isError: isLoadingCategoriesError, data: categories , error } = useCategories();

    return (
        <Grid overflow={'hidden'} width={'100%'}>
            <Tabs
                value={tabIndex}
                onChange={(e, index) => setTabIndex(index)}
                variant="scrollable"
                scrollButtons={'auto'}
                allowScrollButtonsMobile
                slotProps={{
                    list: {
                        sx: {
                            gap: 1,
                        }
                    },
                }}
                sx={{
                    [`& .${tabsClasses.indicator}`]: {
                        display: "none",
                    },
                    [`& .${tabsClasses.scrollButtons}`]: {
                        '&.Mui-disabled': { opacity: 0.3 },
                    },
                }}
            >
                <TabItem
                    label={"Todos"}
                    onClick={() => onClick(null)}
                />
                {
                    isLoadingCategories ? (
                        <InlineLoading message={'Cargando categorías'} />
                    ) : categories && categories.length > 0 ? (
                        categories.map(category => (
                            <TabItem
                                label={category.name}
                                key={category.id}
                                onClick={() => onClick(category.id)}
                            />
                        ))
                    ) : null
                }

            </Tabs>
        </Grid>
    );
}