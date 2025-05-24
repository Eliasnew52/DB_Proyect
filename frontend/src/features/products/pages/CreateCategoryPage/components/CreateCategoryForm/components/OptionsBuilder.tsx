import {Button, Collapse, Grid, IconButton, TextField} from "@mui/material";
import {Controller, useFieldArray, useFormContext} from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import {useCallback} from "react";
import {TransitionGroup} from "react-transition-group";

export const OptionsBuilder = ({ name }) => {

    const { control } = useFormContext();

    const { fields, remove, append } = useFieldArray({
        control,
        name: "options",
    })

    const handleAddOption = useCallback(() => {
        append('')
    }, [append])

    const handleRemoveOption = useCallback((optionIndex: number) => {
        remove(optionIndex)
    }, [remove])

    return (
        <Grid>
            {
                fields.map((option, i) => (
                    <TransitionGroup>
                        <Collapse>
                            <Grid container flexDirection={'column'} key={option.id}>
                                <Controller
                                    name={`${name}.${i}`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            fullWidth
                                            placeholder={`Opción ${i + 1}`}
                                        />
                                    )}
                                />

                                <Grid>
                                    <IconButton size="small" onClick={handleRemoveOption}>
                                        <CloseIcon fontSize="small"/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </TransitionGroup>
                ))
            }
            <Grid>
                <Button startIcon={<AddIcon />} onClick={handleAddOption}>
                    Añadir opción
                </Button>
            </Grid>
        </Grid>
    )
}