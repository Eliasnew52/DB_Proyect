import {useCallback} from "react";
import {TransitionGroup} from "react-transition-group";
import {Button, Collapse, Grid, IconButton, TextField} from "@mui/material";
import {Controller, useFieldArray, useFormContext} from "react-hook-form";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';

export const OptionsBuilder = ({ name }: {name: string}) => {

    const { control } = useFormContext();



    return (

    )
}