import {forwardRef} from "react";
import {
    Button, Card, CardActionArea, CardActions, CardContent,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle, Divider, FormControl,
    Grid, IconButton, InputLabel, MenuItem, Select,
    Slide,
    TextField, Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AttributeBuilderModal = ({ open, handleClose, newKey, setNewKey, newType, setNewType, attributes, addAttribute, removeAttribute }) => {

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
            <DialogContent>

                {attributes.map((field, idx) => (
                    <Card key={idx} elevation={0} sx={{
                        border: "1px solid #E5E5E7",
                        padding: 0,
                    }}>
                        <Grid container justifyContent={'space-between'} alignItems={'center'}>
                            <CardContent sx={{height: '100%'}}>
                                    <Grid container flexDirection={'column'} spacing={0}>
                                        <Typography fontWeight={500}>
                                            {field.key}
                                        </Typography>
                                        <Typography fontSize={'small'} color={'textSecondary'}>
                                            {field.type}
                                        </Typography>
                                    </Grid>
                            </CardContent>
                            < CardActions>
                                <IconButton size={'small'} onClick={() => removeAttribute(idx)}>
                                    <CloseIcon fontSize={'small'} />
                                </IconButton>
                            </CardActions>
                        </Grid>
                    </Card>
                ))}

                <Grid border={'2px dashed #ddd'} borderRadius={2} p={2}>
                    <Grid>
                        <Typography>
                            Nuevo campo
                        </Typography>
                    </Grid>

                    <Grid
                        container
                        flexDirection={'column'}
                        spacing={1}
                    >
                        <Grid container spacing={0} flexGrow={1}>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <Grid>
                                    <Typography>Tipo de campo</Typography>
                                </Grid>

                                    <Select
                                        variant={'outlined'}
                                        value={newType}
                                        size="small"
                                        fullWidth
                                        onChange={e => setNewType(e.target.value)}

                                    >
                                        <MenuItem value="string">Texto</MenuItem>
                                        <MenuItem value="number">Número</MenuItem>
                                        <MenuItem value="enum">Lista</MenuItem>
                                        <MenuItem value="boolean">Booleano</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>

                        <Grid container spacing={0} flexGrow={1}>
                            <Typography>Nombre del campo</Typography>

                            <TextField
                                value={newKey}
                                size={'small'}
                                placeholder="Nombre del campo"
                                fullWidth
                                onChange={e => setNewKey(e.target.value)}
                            />
                        </Grid>

                        <Button
                            variant={'outlined'}
                            startIcon={<AddIcon />}
                            onClick={addAttribute}
                        >
                            Agregar este campo
                        </Button>
                    </Grid>
                </Grid>


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant={'outlined'}>Cancelar</Button>
                <Button onClick={handleClose} variant={'contained'}>Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

// {
//     fields.map((field, idx) => {
//         const type = watch(`attributes.${idx}.type`)
//
//         return <Grid
//             key={field.id}
//             container
//             flexDirection={'column'}
//             spacing={2}
//         >
//
//             <Grid
//                 container
//                 flexDirection="column"
//                 spacing={1}
//             >
//                 { idx !== 0 && <Divider sx={{ mt: 2, mb: 5 }} /> }
//
//                 <Grid container spacing={0} flexGrow={1}>
//                     <FormControl fullWidth sx={{ mt: 2 }}>
//                         <Grid
//                             container
//                             alignItems={'center'}
//                             justifyContent={'space-between'}
//                             width={'100%'}
//                         >
//                             <Typography>Tipo</Typography>
//                             <IconButton onClick={() => remove(idx)}>
//                                 <CloseIcon fontSize={'small'} />
//                             </IconButton>
//                         </Grid>
//
//                         <Controller
//                             name={`attributes.${idx}.type`}
//                             control={control}
//                             render={({ field }) => (
//                                 <Select
//                                     {...field}
//                                     id={`char-type-${idx}`}
//                                     size="small"
//                                     displayEmpty
//                                     fullWidth
//                                 >
//                                     <MenuItem value="" disabled>
//                                         <Typography color={'#959495'}>Elige un tipo</Typography>
//                                     </MenuItem>
//                                     <MenuItem value="string">Texto</MenuItem>
//                                     <MenuItem value="number">Número</MenuItem>
//                                     <MenuItem value="enum">Lista</MenuItem>
//                                     <MenuItem value="boolean">Booleano</MenuItem>
//                                 </Select>
//                             )}
//                         />
//                     </FormControl>
//                 </Grid>
//
//                 <Grid container spacing={0} flexGrow={1}>
//                     <Typography>Campo</Typography>
//                     <Controller
//                         name={`attributes.${idx}.key`}
//                         control={control}
//                         render={({field}) => (
//                             <TextField {...field} size={'small'} label="Nombre del campo" fullWidth />
//                         )}
//                     />
//                 </Grid>

//                 { type === 'string' && (
//                     <Grid container spacing={0}>
//                         <Typography>Valor</Typography>
//                         <Controller
//                             name={`attributes.${idx}.value`}
//                             control={control}
//                             render={({field}) => (
//                                 <TextField {...field} size={'small'} label="Nombre del campo" fullWidth/>
//                             )}
//                         />
//                     </Grid>
//                 )}
//
//                 { type === 'enum' && (
//                     <EnumEditor key={idx} name={`attributes.${idx}.options`} />
//                 )}
//
//                 {/*{ type === 'boolean' && (*/}
//                 {/*    <Controller*/}
//                 {/*        name={`characteristics.${idx}.options`}*/}
//                 {/*        control={control}*/}
//                 {/*        render={({ field }) => (*/}
//                 {/*            <Switch*/}
//                 {/*                checked={!!field.value?.[0]}*/}
//                 {/*                onChange={(_, v) => field.onChange([String(v)])}*/}
//                 {/*            />*/}
//                 {/*        )}*/}
//                 {/*    />*/}
//                 {/*)}*/}
//             </Grid>
//
//         </Grid>
//     })
// }