import React, { ReactNode } from 'react';
import {Container, Box, Grid} from '@mui/material';

interface ContentContainerProps {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    padding?: number;
    marginTop?: number;
    borderRadius?: number;
    borderColor?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 4,
  marginTop = 4,
  borderRadius = 2,
  borderColor = 'grey.300',
}) => (
    <Grid maxWidth={maxWidth}>
        <Box
            sx={{
                border: '1px solid',
                borderColor,
                borderRadius,
                p: padding,
                mt: marginTop,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: 'background.paper',
            }}
        >
            {children}
        </Box>
    </Grid>
);
