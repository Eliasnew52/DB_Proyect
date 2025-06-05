import {Grid, Typography} from "@mui/material";
import {ContentContainer} from "../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Measurements} from "../../../../../../../../common/types/products.types.ts";
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import {MeasurementCard} from "./MeasurementCard.tsx";

export const DimensionsTabPanel = ({ measurements }: { measurements?: Measurements }) => {

    return (
        <ContentContainer>
            <Grid
                sx={{
                    display: "inline-grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
                    gap: 2,
                    height: 'auto',
                }}
            >

                <MeasurementCard
                    label={'Longitud'}
                    Icon={StraightenOutlinedIcon}
                    value={measurements?.length}
                    unit={measurements?.length_unit}
                />

                <MeasurementCard
                    label={'Ancho'}
                    Icon={StraightenOutlinedIcon}
                    value={measurements?.width}
                    unit={measurements?.length_unit}
                />

                <MeasurementCard
                    label={'Alto'}
                    Icon={StraightenOutlinedIcon}
                    value={measurements?.height}
                    unit={measurements?.length_unit}
                />

                <MeasurementCard
                    label={'Volumen'}
                    Icon={StraightenOutlinedIcon}
                    value={measurements?.volume}
                    unit={measurements?.volume_unit}
                />

                <MeasurementCard
                    label={'Peso'}
                    Icon={FitnessCenterOutlinedIcon}
                    value={measurements?.weight}
                    unit={measurements?.weight_unit}
                />

            </Grid>

        </ContentContainer>
    )
}