import {Button, Collapse, Grid, IconButton, TextField, Typography} from "@mui/material";
import {TransitionGroup} from "react-transition-group";
import {Controller, useFieldArray, useFormContext} from "react-hook-form";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddIcon from "@mui/icons-material/Add";
import {useCallback} from "react";

export const EnumEditor = ({ name }: {name: string}) => {

    const { control } = useFormContext();

    const { fields, remove, append } = useFieldArray({
        control,
        name: name,
    })
    
    const handleAddOption = useCallback(() => {
        append({ value: '' })
    }, [append])

    const handleRemoveOption = useCallback((idx: number) => {
        remove(idx)
    }, [remove])

    return (
        <Grid container flexDirection={'column'} spacing={0}>
            <Grid>
                <Typography>Opciones</Typography>
            </Grid>

            <Grid container flexDirection={'column'}>
                <Grid container flexDirection={'column'} spacing={2}>
                    {
                            fields.map((option, i) => (
                                <Grid container alignItems={'center'} key={option.id}>
                                    <Controller
                                        name={`${name}.${i}.value`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                size="small"
                                                placeholder={`Opción ${i + 1}`}
                                                sx={{
                                                    flexGrow: 1
                                                }}
                                            />
                                        )}
                                    />
                                    <IconButton size="small" onClick={() => handleRemoveOption(i)}>
                                        <RemoveCircleIcon color={'error'} fontSize="small"/>
                                    </IconButton>
                                </Grid>
                            ))
                        }
                    <Grid>
                        <Button variant={'outlined'} startIcon={<AddIcon />} onClick={handleAddOption}>
                            Añadir opción
                        </Button>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )
}