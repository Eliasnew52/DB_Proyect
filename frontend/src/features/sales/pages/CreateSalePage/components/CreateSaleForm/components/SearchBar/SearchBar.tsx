import {Grid, InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {SearchBarProps} from "./SearchBar.types.ts";
import {useEffect, useState} from "react";

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue, onChange]);

    return (
        <Grid width={'100%'}>
            <TextField
                type="search"
                placeholder={'Buscar productos por nombre o categoría...'}
                fullWidth
                size={'small'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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