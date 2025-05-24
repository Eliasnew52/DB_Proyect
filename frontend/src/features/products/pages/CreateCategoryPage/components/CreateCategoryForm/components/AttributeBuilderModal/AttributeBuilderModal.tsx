import {forwardRef, useCallback, useEffect, useState} from "react";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Slide,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AttributeCardList } from "./components/AttributeCardList.tsx";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AttributeBuilderModal = ({
      open,
      handleClose,
      newKey,
      setNewKey,
      newType,
      setNewType,
      attributes,
      setAttributes,
  }) => {
    const [newOptions, setNewOptions] = useState<string[]>([]);
    const [optionInput, setOptionInput] = useState("");
    const [keyError, setKeyError] = useState<string>();
    const [optionError, setOptionError] = useState<string>();
    const [localAttrs, setLocalAttrs] = useState(attributes);

    useEffect(() => {
        if (open) setLocalAttrs(attributes);
    }, [open, attributes]);

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setNewKey(v);
        const t = v.trim();
        if (!t) {
            setKeyError("El nombre del campo es obligatorio");
        } else if (!/^[a-zA-Z0-9]+$/.test(t)) {
            setKeyError("Sólo letras y números");
        } else if (attributes.some((a) => a.key === t)) {
            setKeyError("Ya existe un campo con esa clave");
        } else {
            setKeyError(undefined);
        }
    };

    const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setOptionInput(v);
        const t = v.trim();
        if (newOptions.includes(t)) {
            setOptionError("Ya existe esa opción");
        } else {
            setOptionError(undefined);
        }
    };

    const addOption = () => {
        const val = optionInput.trim();
        if (!val || !!optionError) return;
        setNewOptions((opts) => [...opts, val]);
        setOptionInput("");
        setOptionError(undefined);
    };

    const removeOption = (idx: number) => {
        setNewOptions((opts) => opts.filter((_, i) => i !== idx));
    };

    const addAttribute = () => {
        const key = newKey.trim();
        if (!key || !newType.trim() || !!keyError) return;

        if (newType === "enum" && newOptions.length === 0) {
            setKeyError("Los enums necesitan al menos una opción");
            return;
        }

        setLocalAttrs(prev => [
            ...prev,
            { key: newKey.trim(), title: newKey.trim(), type: newType, options: newOptions }
        ]);
        setNewKey("");
        setNewType("");
        setNewOptions([]);
        setOptionInput("");
        setOptionError(undefined);
        setKeyError(undefined);
    };

    const removeAttribute = useCallback(
        (idx: number) => {
            setLocalAttrs(prev => prev.filter((_, i) => i !== idx));
        },
        []
    );

    const handleSave = () => {
        setAttributes(localAttrs);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            slots={{ transition: Transition }}
            keepMounted
            onClose={handleClose}
            scroll={"paper"}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Personaliza los campos de tus productos</DialogTitle>
            <DialogContent>
                <Grid container flexDirection="column" spacing={2}>
                    <AttributeCardList
                        attributes={localAttrs}
                        removeAttribute={removeAttribute}
                    />

                    <Grid border={"2px dashed #ddd"} borderRadius={2} p={2}>
                        <Grid>
                            <Typography>Nuevo campo</Typography>
                        </Grid>

                        <Grid container flexDirection={"column"} spacing={1}>
                            <Grid container spacing={0} flexGrow={1}>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <Grid>
                                        <Typography>Tipo de campo</Typography>
                                    </Grid>

                                    <Select
                                        variant={"outlined"}
                                        value={newType}
                                        size="small"
                                        fullWidth
                                        onChange={(e) => setNewType(e.target.value)}
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
                                    size={"small"}
                                    placeholder="Nombre del campo"
                                    fullWidth
                                    onChange={onKeyChange}
                                    error={!!keyError}
                                    helperText={keyError || ""}
                                />
                            </Grid>

                            {newType === "enum" && (
                                <Grid mt={2}>
                                    <Typography>Opciones disponibles</Typography>

                                    <Grid mb={1}>
                                        {newOptions.map((opt, i) => (
                                            <Chip
                                                key={i}
                                                label={opt}
                                                onDelete={() => removeOption(i)}
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        ))}
                                    </Grid>

                                    <Grid container flexDirection={"column"}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid container flexGrow={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Escribe una opción…"
                                                    value={optionInput}
                                                    onChange={onOptionChange}
                                                    error={!!optionError}
                                                />
                                            </Grid>
                                            <Grid>
                                                <IconButton color="primary" onClick={addOption}>
                                                    <AddIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        {optionError && (
                                            <FormHelperText error>{optionError}</FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                            )}

                            <Button
                                variant={"outlined"}
                                startIcon={<AddIcon />}
                                onClick={addAttribute}
                                disabled={
                                    !newKey ||
                                    !newType ||
                                    (newType === "enum" && newOptions.length === 0)
                                }
                            >
                                Agregar este campo
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant={"outlined"}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={localAttrs.length === 0}
                    variant={"contained"}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
