import {Grid, Typography} from "@mui/material";
import {formatDate} from "../../../../../../../../common/utils/formatDate.ts";
import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export const DetailsTabPanel = ({ createdAt, lastUpdatedAt, createdBy }: { createdAt?: string, lastUpdatedAt?: string, createdBy?: string }) => {
    return (
        <ContentContainer
            spacing={1}
        >
            <Grid
                container
                spacing={1}
            >
                <Grid
                    container
                    alignItems={'center'}
                >
                    <WatchLaterOutlinedIcon
                        fontSize="small"
                        sx={{
                            color: 'grey.600'
                        }}
                    />
                    <Typography
                        color={'grey.600'}
                    >
                        Creado:
                    </Typography>
                </Grid>

                <Grid>
                    { formatDate(createdAt) }
                </Grid>

            </Grid>

            <Grid
                container
                spacing={1}
            >
                <Grid
                    container
                    alignItems={'center'}
                >
                    <WatchLaterOutlinedIcon
                        fontSize="small"
                        sx={{
                            color: 'grey.600'
                        }}
                    />
                    <Typography
                        color={'grey.600'}
                    >
                        Última actualización:
                    </Typography>
                </Grid>

                <Grid>
                    { formatDate(lastUpdatedAt) }
                </Grid>

            </Grid>

            <Grid
                container
                spacing={1}
            >
                <Grid
                    container
                    alignItems={'center'}
                >
                    <PersonOutlineOutlinedIcon
                        fontSize="small"
                        sx={{
                            color: 'grey.600'
                        }}
                    />
                    <Typography
                        color={'grey.600'}
                    >
                        Creado por:
                    </Typography>
                </Grid>

                <Grid>
                    { createdBy ?? "-" }
                </Grid>

            </Grid>
        </ContentContainer>
    )
}