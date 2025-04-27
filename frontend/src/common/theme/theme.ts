import {createTheme} from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: "'Geist', sans-serif",
        h1: { fontSize: "2.5rem", fontWeight: 700 },
        h2: { fontSize: "2rem", fontWeight: 600 },
        h3: { fontSize: "1.75rem", fontWeight: 500 },
        body1: { fontSize: "1rem", fontWeight: 400 },
        button: { textTransform: "none", fontWeight: 600 },
    },
});

export default theme;