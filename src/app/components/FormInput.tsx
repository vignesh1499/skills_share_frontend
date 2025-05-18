import React, { useEffect, useMemo } from 'react';
import {
  TextField,
  FormControl,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import { Grid } from '@material-ui/core';
import { useFormContext, FieldValues, Path } from 'react-hook-form';

type SelectOption = {
  label: string;
  value: string;
};

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: string;
  select?: boolean;
  options?: SelectOption[];
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  defaultValue?: string | number | boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  select = false,
  options = [],
  multiline = false,
  rows,
  fullWidth = true,
  defaultValue,
  inputProps,
}: FormInputProps<T>) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<T>();

  // Prevent unnecessary setValue if already set
  useEffect(() => {
    const currentValue = getValues(name);
    if (defaultValue !== undefined && currentValue !== defaultValue) {
      setValue(name, defaultValue as any, { shouldValidate: false, shouldDirty: false });
    }
  }, [defaultValue, name, setValue, getValues]);

  const error = errors[name];
  const helperText = error?.message?.toString() || '';

  const menuItems = useMemo(() => (
    options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))
  ), [options]);

  if (type === 'checkbox') {
    return (
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              {...register(name)}
              color="primary"
              defaultChecked={Boolean(defaultValue)}
            />
          }
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
          inputProps={inputProps}
          defaultValue={defaultValue}
        >
          {select && menuItems}
        </TextField>
      </FormControl>
    </Grid>
  );
};

export default React.memo(FormInput);
