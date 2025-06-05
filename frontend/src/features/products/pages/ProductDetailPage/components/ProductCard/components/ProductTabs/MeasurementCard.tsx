import {ComponentType} from "react";
import { ContentContainer } from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Grid, SvgIconProps, Typography} from "@mui/material";

interface MeasurementCardProps {
    label: string;
    value?: string | number;
    unit?: string;
    Icon?: ComponentType<SvgIconProps>;
}

export const MeasurementCard = ({ label, value, unit, Icon }: MeasurementCardProps) => (
    <ContentContainer>
        <Grid
            container
            flexDirection={'column'}
            alignItems={'center'}
            spacing={0}
        >
            {Icon && <Icon fontSize="small" />}
            <Grid>
                <Typography color={'grey.600'}>
                    {label}
                </Typography>
            </Grid>
            <Grid>
                <Typography fontWeight={'bold'}>
                    {value} {unit}
                </Typography>
            </Grid>
        </Grid>
    </ContentContainer>
);