import {Controller, useFormContext} from "react-hook-form";
import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {timePeriods} from "../../../utils/timePeriods.ts";

export const DateRangePicker = () => {
  const { control } = useFormContext();

  return (
      <Grid
        container
        spacing={1}
      >
          <Controller
              control={control}
              name={'from_date'}
              render={({ field }) => (
                  <TextField
                      {...field}
                      id={'from_date'}
                      variant={'outlined'}
                      size={'small'}
                      type={'date'}
                      label={'Fecha de inicio'}
                      slotProps={{
                          inputLabel: {
                              shrink: true
                          }
                      }}
                  />
              )}
          />

          <Controller
              control={control}
              name={'to_date'}
              render={({ field }) => (
                  <TextField
                      {...field}
                      id={'to_date'}
                      variant={'outlined'}
                      size={'small'}
                      type={'date'}
                      label={'Fecha final'}
                      slotProps={{
                          inputLabel: {
                              shrink: true
                          }
                      }}
                  />
              )}
          />

          <Controller
              name={'group_by'}
              control={control}
              render={({ field, fieldState }) => (
                  <FormControl
                      size={'small'}
                      variant="outlined"
                      error={fieldState.invalid}
                      sx={{
                          minWidth: 180
                      }}
                  >
                      <InputLabel id="group_by-label">Agrupar por</InputLabel>
                      <Select
                          {...field}
                          labelId="group_by-label"
                          id="group_by-select"
                          size={'small'}
                          label={'Agrupar por'}
                      >
                          <MenuItem
                              value={'hour'}
                          >
                            Horas
                          </MenuItem>
                          <MenuItem
                            value={'day'}
                          >
                            Días
                          </MenuItem>
                          <MenuItem
                            value={'week'}
                          >
                            Semana
                          </MenuItem>
                          <MenuItem
                            value={'month'}
                          >
                            Mes
                          </MenuItem>
                          <MenuItem
                            value={'year'}
                          >
                            Año
                          </MenuItem>
                      </Select>
                      {
                          fieldState.error && (
                              <FormHelperText>
                                  { fieldState.error.message }
                              </FormHelperText>
                          )
                      }
                  </FormControl>
              )}
          />
      </Grid>
  );
};