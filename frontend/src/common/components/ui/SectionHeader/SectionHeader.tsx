import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { SectionHeaderProps } from "./SectionHeader.types.ts";

export const SectionHeader: React.FC<SectionHeaderProps> = ({
        title,
        subtitle,
        Icon,
        isRequired = false
    }) => (
    <Grid container flexDirection="column" mb={1}>
        <Grid
            container
            spacing={1}
            alignItems="center"
            wrap="nowrap"
            sx={{ whiteSpace: 'nowrap' }}
        >
            {Icon && <Icon fontSize="small" />}

            <Typography
                component="h2"
                noWrap
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.375rem' },
                }}
            >
                {title}
                { isRequired && (
                    <Box component="span" color="error.main" ml={0.5}>
                        *
                    </Box>
                ) }
            </Typography>
        </Grid>

        {subtitle && (
            <Typography sx={{ fontSize: 14, color: 'gray', mt: 0.5 }}>
                {subtitle}
            </Typography>
        )}
    </Grid>
);
