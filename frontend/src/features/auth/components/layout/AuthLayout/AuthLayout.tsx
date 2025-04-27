import {Outlet} from 'react-router';
import {Grid} from "@mui/material";
import loginImg from '../../../assets/images/login.png';

export const AuthLayout = () => {
    return (
        <Grid
            container
            minHeight={'100vh'}
        >
            <Grid
                container
                flexDirection={'column'}
                size={{xs: 12, sm: 12, md: 4, lg: 4, xl: 4}}
                minHeight={'100vh'}
            >
                <Outlet/>
            </Grid>
            <Grid
                container
                size={{xs: 0, sm: 0, md: 8, lg: 8, xl: 8}}
                height={'100vh'}
            >
                <Grid
                    component={'img'}
                    src={loginImg}
                    sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Grid>

        </Grid>
    )
}