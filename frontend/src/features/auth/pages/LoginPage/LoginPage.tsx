import {Grid} from "@mui/material";
import {LoginForm} from "./components/LoginForm/LoginForm.tsx";

const LoginPage = () => {
    return (
        <Grid
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            spacing={2}
            padding={4}
            height={'100%'}
        >
            <LoginForm />
        </Grid>
    )
}

export default LoginPage;