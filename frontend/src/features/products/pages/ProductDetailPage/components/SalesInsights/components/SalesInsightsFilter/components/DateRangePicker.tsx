import {Controller, useFormContext} from "react-hook-form";
import {Grid, TextField} from "@mui/material";

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
      </Grid>
  );
};