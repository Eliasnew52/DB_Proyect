import {Grid} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {ProviderTable} from "./components/ProviderTable/ProviderTable.tsx";

export const ListProviderPage = () => {
    return (
        <Grid>
            <SectionHeader
                title={'Lista de proveedores'}
                subtitle={'Maneja los proveedores'}
            />

            <ProviderTable />
        </Grid>
    )
}