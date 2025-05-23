import {forwardRef} from "react";
import {Controller} from "react-hook-form";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, Divider, FormControl, FormLabel,
    Grid, IconButton, InputLabel, MenuItem, Select,
    Slide, Switch,
    TextField, Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AttributeBuilderModal = ({ fields, append, remove, open, handleClose, control, watch }) => {
    return (
        <Dialog
            open={open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={handleClose}
            scroll={'paper'}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Personaliza los campos de tus productos</DialogTitle>
            <DialogContent dividers>

                {
                    fields.map((field, idx) => {
                        const type = watch(`characteristics.${idx}.type`)

                        return <Grid
                            key={field.id}
                            container
                            flexDirection={'column'}
                            spacing={2}
                        >

                            <Grid
                                container
                                flexDirection="column"
                                spacing={1}
                            >
                                { idx !== 0 && <Divider sx={{ mt: 2, mb: 5 }} /> }

                                    <Grid container spacing={0} flexGrow={1}>
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <Grid
                                                container
                                                alignItems={'center'}
                                                justifyContent={'space-between'}
                                                width={'100%'}
                                            >
                                                <Typography>Tipo</Typography>
                                                <IconButton onClick={() => remove(field.id)}>
                                                    <CloseIcon fontSize={'small'} />
                                                </IconButton>
                                            </Grid>

                                            <Controller
                                                name={`characteristics.${idx}.type`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        id={`char-type-${idx}`}
                                                        size="small"
                                                        displayEmpty
                                                        fullWidth
                                                    >
                                                        <MenuItem value="" disabled>
                                                            <Typography color={'#959495'}>Elige un tipo</Typography>
                                                        </MenuItem>
                                                        <MenuItem value="string">Texto</MenuItem>
                                                        <MenuItem value="number">Número</MenuItem>
                                                        <MenuItem value="enum">Lista</MenuItem>
                                                        <MenuItem value="boolean">Booleano</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid container spacing={0} flexGrow={1}>
                                        <Typography>Campo</Typography>
                                        <Controller
                                            name={`characteristics.${idx}.key`}
                                            control={control}
                                            render={({field}) => (
                                                <TextField {...field} size={'small'} label="Nombre del campo" fullWidth />
                                            )}
                                        />
                                    </Grid>

                                    { type === 'string' && (
                                        <Grid container spacing={0}>
                                            <Typography>Valor</Typography>
                                            <Controller
                                                name={`characteristics.${idx}.value`}
                                                control={control}
                                                render={({field}) => (
                                                    <TextField {...field} size={'small'} label="Nombre del campo" fullWidth/>
                                                )}
                                            />
                                        </Grid>
                                    )}

                                    { type === 'enum' && (
                                        <Grid container spacing={0}>
                                            <Typography>Opciones</Typography>
                                            <Controller
                                                name={`characteristics.${idx}.options`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        multiple
                                                        freeSolo
                                                        options={[]}
                                                        fullWidth
                                                        onChange={(_, v) => field.onChange(v)}
                                                        value={field.value || []}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                size={'small'}
                                                                placeholder=""
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                            <Button startIcon={<KeyboardArrowDownIcon />}>
                                                Gestionar opciones
                                            </Button>
                                        </Grid>
                                    )}

                                    { type === 'boolean' && (
                                        <Controller
                                            name={`characteristics.${idx}.options`}
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={!!field.value?.[0]}
                                                    onChange={(_, v) => field.onChange([String(v)])}
                                                />
                                            )}
                                        />
                                    )}
                            </Grid>

                        </Grid>
                    })
                }
                <Grid mt={3}>
                    <Button startIcon={<AddIcon />} onClick={() => append({ key: '', title: '', type: '', options: [] })}>
                        Agregar campo
                    </Button>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant={'outlined'}>Cancelar</Button>
                <Button onClick={handleClose} variant={'contained'}>Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}