import {Grid, Typography} from "@mui/material";
import {ContentContainer} from "../../../../../../../../../../common/components/ui/ContentContainer.tsx";
import CountUp from "react-countup";
import {SalesMetricCardProps} from "./SalesMetricCard.types.ts";

export const SalesMetricCard = ({ label, prefix, decimals, value, children }: SalesMetricCardProps) => {
    return (
        <ContentContainer>
            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                        <Grid>
                            <Typography fontWeight="bold" fontSize={25}>
                                <CountUp prefix={prefix} decimals={decimals} end={value ?? 0} />
                            </Typography>
                        </Grid>
                        <Grid>
                            <Typography
                                fontSize={14}
                                color={'grey.600'}
                                fontWeight={'bold'}
                            >
                                { label }
                            </Typography>
                        </Grid>
                        {
                            children && (
                                <Grid>
                                    { children }
                                </Grid>
                            )
                        }

            </Grid>
        </ContentContainer>
    )
}