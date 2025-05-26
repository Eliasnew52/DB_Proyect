import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {Button, Grid, InputAdornment, InputLabel, TextField, Typography} from "@mui/material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {PasswordField} from "../../../../components/PasswordField/PasswordField.tsx";
import {useLogin} from "../../../../hooks/useLogin.ts";
import logo from '../../../../assets/images/logo.png';
import {useRouteNavigator} from "../../../../../../common/hooks/useRouteNavigator.ts";
import {RouteKey} from "../../../../../../common/router/routes.ts";
import {useNotifications} from "../../../../../../common/hooks/useNotifications.ts";
import type {LoginFormValues} from "./LoginForm.types.ts";

export const LoginForm = () => {
    const methods = useForm<LoginFormValues>({
        mode: 'onChange',
        defaultValues: { username: '', password: '' }
    });

    const { register, handleSubmit } = methods;

    const login = useLogin();
    const { go } = useRouteNavigator();
    const { showToast } = useNotifications();


    const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
        login.mutate(data, {
            onSuccess: response => {
                go(RouteKey.DASHBOARD)
            },
            onError: error => {
                showToast({ icon: 'error', title: error.message })
            }
        });
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