import {AttributeCard} from "./AttributeCard.tsx";
import {Grid} from "@mui/material";

export const AttributeCardList = ({ attributes, removeAttribute }) => {
    return (
        <Grid container flexDirection={'column'} spacing={1}>
            {attributes.map((attribute, idx) => (
                <AttributeCard key={idx} attribute={attribute} removeAttribute={() => removeAttribute(idx)} />
            ))}
        </Grid>
    )
}