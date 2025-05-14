// TaskForm.tsx
'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, useMediaQuery, useTheme, Box, Paper
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { taskSchema } from '../schemas/task.schema';
import { TaskValues } from '../types/task.types';
import { defaultValues } from '../constants/taskValues';
import FormInput from '../components/FormInput';
import { Grid } from '@material-ui/core';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<TaskValues>;
  isEditMode?: boolean;
  onSubmit: (data: TaskValues) => Promise<void>;
}

export default function TaskForm({
  open, onClose, initialValues = {}, isEditMode = false, onSubmit,
}: TaskFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const methods = useForm<TaskValues>({
    resolver: yupResolver(taskSchema),
    mode: 'onChange',
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const {
    handleSubmit, trigger, formState: { isValid, isSubmitting },
  } = methods;

  const submitHandler = async (data: TaskValues) => {
    const valid = await trigger();
    if (!valid) return;
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogContent dividers>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormInput name="task_name" label="Task Name" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="description" label="Description" multiline rows={3} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="expected_start_date" label="Expected Start Date" type="date" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="expected_working_hours" label="Expected Hours" type="number" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="hourly_rate" label="Hourly Rate" type="text" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="rate_currency" label="Currency" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="category" label="Category" fullWidth />
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', px: 3, py: 2 }}>
            <Button onClick={onClose} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={!isValid || isSubmitting}>
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
