import React, { ReactNode } from 'react';
import {Grid, GridProps, SxProps, Theme} from '@mui/material';

interface ContentContainerProps extends GridProps {
    children: ReactNode;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  sx: sxProp,
  ...gridProps
  }) => {
    const defaultSx: SxProps<Theme> = {
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'background.paper',
    };

    const mergedSx: SxProps<Theme> = Array.isArray(sxProp)
        ? [defaultSx, ...sxProp]
        : sxProp
            ? [defaultSx, sxProp]
            : defaultSx;

    return (
        <Grid
            {...gridProps}
            sx={mergedSx}
        >
            {children}
        </Grid>
    )
};
