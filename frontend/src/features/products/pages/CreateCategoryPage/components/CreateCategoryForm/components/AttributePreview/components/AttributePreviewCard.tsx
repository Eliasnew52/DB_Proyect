import {Chip, Grid, TextField, Typography} from "@mui/material";

export const AttributePreviewCard = ({ attribute }) => {

    return (
        <Grid
            sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                backgroundColor: 'background.paper',
            }}
        >
            <Grid
                container
                spacing={1}
                alignItems={'center'}
            >
                <Grid>
                    <Typography fontWeight={'bold'} color={ attribute.type === 'enum' ? 'success' : 'primary' }>
                        { attribute.key }
                    </Typography>
                </Grid>

                <Chip sx={{ fontWeight: 'bold' }} color={ attribute.type === 'enum' ? 'success' : 'primary' } label={attribute.type} />
            </Grid>

            <Grid>
                {
                    attribute.type === 'enum' ? (
                        <Grid container spacing={1}>
                            {
                                attribute.options.map((option, index) => (
                                    <Chip label={option} key={index} />
                                ))
                            }
                        </Grid>

                    ) : (
                        <TextField size={'small'} value={attribute.key} disabled fullWidth />
                    )
                }
            </Grid>
        </Grid>
    )
}