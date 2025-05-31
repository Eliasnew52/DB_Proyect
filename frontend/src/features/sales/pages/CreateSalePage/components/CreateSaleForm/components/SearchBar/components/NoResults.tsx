import {ContentContainer} from "../../../../../../../../../common/components/ui/ContentContainer.tsx";
import {Grid} from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export const NoResults = ({ search }: { search: string }) => {
    return (
        <ContentContainer
            justifyContent="center"
            alignItems="center"
            width="100%"
        >

            <Grid>
                <SearchOutlinedIcon fontSize={'large'} />
            </Grid>

            <Grid>
                No hemos encontrado productos que coincidan con "{search}".
            </Grid>

        </ContentContainer>
    )
}