import {Alert, Box, Chip, Grid, Typography} from "@mui/material";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import {AttributePreviewCard} from "./components/AttributePreviewCard.tsx";
export const AttributePreview = ({ attributes }) => {

    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: 'background.paper',
            }}
        >

            <Grid container alignItems="center" justifyContent={'space-between'}>
                <Grid container alignItems="center" spacing={1}>
                    <RemoveRedEyeOutlinedIcon sx={{
                        color: '#00000099'
                    }} />
                    <Typography sx={{
                        color: '#00000099'
                    }}>
                        Vista previa de atributos
                    </Typography>
                </Grid>
                <Grid>
                    <Chip label={`${attributes.length} campos`} sx={{ fontWeight: 'bold' }} />
                </Grid>
            </Grid>

            { attributes.map((attribute, index) => (
                <AttributePreviewCard key={index} attribute={attribute}  />

            )) }

            <Grid>
                <Alert severity="info" sx={{ borderRadius: 2 }}>Estos campos aparecerán en el formulario del producto una vez guardados. .</Alert>
            </Grid>

        </Box>
    )
}