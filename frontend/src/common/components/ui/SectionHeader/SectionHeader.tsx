import React from 'react';
import { Grid, Typography } from '@mui/material';
import {PageHeaderProps} from "./PageHeader.types.ts";

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
    <Grid container flexDirection="column" marginBottom={2}>
        <Typography sx={{ fontWeight: 'bold', fontSize: 22 }}>
            {title}
        </Typography>
        {subtitle && (
            <Typography sx={{ fontSize: 14, color: 'gray' }}>
                {subtitle}
            </Typography>
        )}
    </Grid>
);
