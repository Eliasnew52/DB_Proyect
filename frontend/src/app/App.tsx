import {CssBaseline, ThemeProvider} from "@mui/material";
import {AppRouter} from "./routes/AppRouter.tsx";
import theme from "../common/theme/theme.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../common/api/queryClient.ts";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

function App() {

  return (
    <>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppRouter />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

    </>
  )
}

export default App
