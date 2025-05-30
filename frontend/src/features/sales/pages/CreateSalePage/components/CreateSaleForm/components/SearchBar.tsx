import {Grid, InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export const SearchBar = () => {
    return (
        <Grid width={'100%'}>
            <TextField
                type="search"
                placeholder={'Buscar productos por nombre o categoría...'}
                fullWidth
                size={'small'}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position={'start'}>
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }
                }}
            />
        </Grid>
    )
}