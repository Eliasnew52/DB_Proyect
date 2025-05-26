import React from 'react';
import { Grid, Typography } from '@mui/material';
import {SectionHeaderProps} from "./SectionHeader.types.ts";

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, Icon }) => (
    <Grid container flexDirection="column" marginBottom={2}>
        <Grid container spacing={1} alignItems="center">
            {Icon && <Icon />}
            <Typography sx={{ fontWeight: 'bold', fontSize: 22 }}>
                {title}
            </Typography>
        </Grid>
        {subtitle && (
            <Typography sx={{ fontSize: 14, color: 'gray' }}>
                {subtitle}
            </Typography>
        )}
    </Grid>
);
