import {Grid} from "@mui/material";
import {SectionHeader} from "../../../../common/components/ui/SectionHeader/SectionHeader.tsx";
import {CustomerTable} from "./components/CustomerTable/CustomerTable.tsx";

export const ListCustomerPage = () => {
    return (
        <Grid>
            <SectionHeader
                title="Lista de clientes"
                subtitle={'Maneja tus clientes'}
            />
            <CustomerTable />
        </Grid>
    )
}