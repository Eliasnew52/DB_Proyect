import {CssBaseline, ThemeProvider} from "@mui/material";
import {AppRouter} from "./routes/AppRouter.tsx";
import theme from "../common/theme/theme.ts";

function App() {

  return (
    <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRouter />
        </ThemeProvider>
    </>
  )
}

export default App
