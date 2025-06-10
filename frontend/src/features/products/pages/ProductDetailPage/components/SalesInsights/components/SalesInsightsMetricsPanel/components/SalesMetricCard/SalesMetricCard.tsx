import {Grid, Typography} from "@mui/material";
import {ContentContainer} from "../../../../../../../../../common/components/ui/ContentContainer.tsx";
import CountUp from "react-countup";

export const SalesMetricCard = ({ label, value }: { label: string, value: number }) => {

    return (
        <ContentContainer>
            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <Grid>
                    <Typography
                        fontWeight={'bold'}
                        fontSize={25}
                    >
                        <CountUp end={value} />
                    </Typography>
                </Grid>
                <Grid>
                    <Typography
                        fontSize={14}
                        color={'grey.600'}
                    >
                        { label }
                    </Typography>
                </Grid>
            </Grid>
        </ContentContainer>
    )
}