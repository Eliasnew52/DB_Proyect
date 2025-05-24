import {Button, Grid, InputAdornment, InputLabel, TextField, Typography} from "@mui/material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {PasswordField} from "../../../../components/PasswordField/PasswordField.tsx";
import logo from '../../../../assets/images/logo.png';
import {useLogin} from "../../../../hooks/useLogin.ts";
import {FormProvider, useForm} from "react-hook-form";

export const LoginForm = () => {
    const methods = useForm();
    const { register, handleSubmit } = methods;
    const login = useLogin();

    const onSubmit = (data) => {
        login.mutate(data);
    }

    return (
        <FormProvider {...methods}>
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
                component={'form'}
                onSubmit={handleSubmit(onSubmit)}
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
                        {...register('username')}
                    />
                </Grid>
                <Grid>
                    <InputLabel htmlFor={'password'}>
                        Contraseña
                    </InputLabel>
                    <PasswordField />
                </Grid>
                <Grid>
                    <Button loading={login.isPending} type={'submit'} variant={'contained'} fullWidth size={'large'}>
                        Iniciar sesión
                    </Button>
                </Grid>
            </Grid>
        </FormProvider>
    )
}