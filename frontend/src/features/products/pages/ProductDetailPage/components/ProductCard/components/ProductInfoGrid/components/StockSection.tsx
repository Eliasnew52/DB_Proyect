import {Grid, Typography} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

export const StockSection = ({ needsRestock, stock, minimumStock } : { needsRestock?: boolean, stock?: number, minimumStock?: number }) => {

    return (
        <Grid
            container
            spacing={20}
        >
            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <Grid>
                    <Typography
                        fontSize={14}
                        color={'grey.600'}
                    >
                        Stock actual
                    </Typography>
                </Grid>

                <Grid
                    container
                    alignItems={"center"}
                    spacing={1}
                >
                    <Grid>
                        <Typography
                            fontSize={20}
                            fontWeight={'bold'}
                            color={ needsRestock ? 'error' : 'success' }
                        >
                            { stock }
                        </Typography>
                    </Grid>

                    {
                        needsRestock ? (
                            <WarningAmberOutlinedIcon
                                color={'error'}
                            />
                        ) : (
                            <TaskAltOutlinedIcon
                                color={'success'}
                            />
                        )
                    }
                </Grid>
            </Grid>

            <Grid
                container
                flexDirection={'column'}
                spacing={0}
            >
                <Grid>
                    <Typography
                        fontSize={14}
                        color={'grey.600'}
                    >
                        Stock mínimo
                    </Typography>
                </Grid>

                <Grid>
                    <Typography
                        fontSize={20}
                        fontWeight={'bold'}
                    >
                        { minimumStock }
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}