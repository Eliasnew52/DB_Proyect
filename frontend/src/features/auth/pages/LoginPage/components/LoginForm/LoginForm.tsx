import {Button, Grid, InputAdornment, InputLabel, TextField, Typography} from "@mui/material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {PasswordField} from "../../../../components/PasswordField/PasswordField.tsx";
import logo from '../../../../assets/images/logo.png';

export const LoginForm = () => {

    return (
        <>
            <Grid maxWidth={150}>
                <Grid component={'img'} src={logo} alt="logo" maxWidth={'100%'} />
            </Grid>

            <Grid>
                <Typography variant={'h1'} fontWeight={'bold'}>
                    Inicia sesión
                </Typography>
                <Typography component={'span'}>
                    Por favor, inicia sesión con tu cuenta
                </Typography>
            </Grid>

            <Grid
                container
                flexDirection={"column"}
                width={'100%'}
                spacing={2}
            >
                <Grid>
                    <InputLabel htmlFor={'username'}>
                        Nombre de usuario
                    </InputLabel>
                    <TextField
                        id={'username'}
                        variant={'outlined'}
                        size={'small'}
                        fullWidth
                        placeholder={'Ingrese su nombre de usuario'}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutlineIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid>
                    <InputLabel htmlFor={'username'}>
                        Contraseña
                    </InputLabel>
                    <PasswordField />
                </Grid>
                <Grid>
                    <Button variant={'contained'} fullWidth size={'large'}>
                        Iniciar sesión
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}