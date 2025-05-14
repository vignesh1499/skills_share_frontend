'use client';

import {
  TextField,
  FormControl,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useFormContext, FieldValues, Path, } from 'react-hook-form';
import { Grid } from '@material-ui/core';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  defaultValue?: string | number | boolean; // Add defaultValue prop to handle default value
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  select = false,
  children,
  multiline = false,
  rows,
  fullWidth = true,
  defaultValue , // Handling defaultValue
}: FormInputProps<T>) => {
  const {
    register,
    formState: { errors },
    setValue, // Added setValue hook
  } = useFormContext<T>();

  const error = errors[name];
  const helperText = error?.message?.toString() || '';

  // Set default value for the field if provided
  if (defaultValue !== undefined) {
    setValue(name, defaultValue as any); 
  }

  if (type === 'checkbox') {
    return (
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox {...register(name)} color="primary" defaultChecked={defaultValue as boolean} />}
          label={label}
        />
      </Grid>
    );
  }

  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth={fullWidth} margin="normal">
        <TextField
          {...register(name)}
          label={label}
          type={type}
          select={select}
          size="small"
          error={!!error}
          helperText={helperText}
          multiline={multiline}
          rows={rows}
          fullWidth={fullWidth}
          defaultValue={defaultValue} // Use defaultValue for TextField
        >
          {select ? children : null}
        </TextField>
      </FormControl>
    </Grid>
  );
};

export default FormInput;
