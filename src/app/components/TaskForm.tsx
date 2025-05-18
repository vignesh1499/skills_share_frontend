import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useForm,
  FormProvider,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import Grid from '@material-ui/core/Grid';

import SubmitModal from './SubmitModal';
import FormInput from './FormInput';
import { taskSchema } from '../schemas/task.schema';
import { Task } from '../types/task.types';
import { defaultValues } from '../constants/taskValues';
import { addTask, getTasks, updateTask } from '../services/task.service';
import { get } from 'http';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<Task>;
  isEditMode?: boolean;
  onSubmit?: (data: Task) => Promise<void>;
  onSuccess?: () => Promise<void>;
}

export default function TaskForm({
  open,
  onClose,
  initialValues = {},
  isEditMode = false,
  onSuccess,
}: TaskFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultFormValues = useMemo(
    () => ({
      ...defaultValues,
      expected_start_date: today,
      ...initialValues,
    }),
    [initialValues, today]
  );

  const methods = useForm<Task>({
    resolver: yupResolver(taskSchema),
    mode: 'onChange',
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { isValid, isSubmitting },
  } = methods;

  const [formData, setFormData] = useState<Task | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success?: string; error?: string }>({});

  useEffect(() => {
    reset(defaultFormValues);
  }, [defaultFormValues, reset]);

  const submitHandler: SubmitHandler<Task> = useCallback(
    async (data) => {
      const isValidForm = await trigger();
      if (!isValidForm) return;

      setFormData(data);
      setOpenConfirm(true);
    },
    [trigger]
  );

  const handleFinalSubmit = useCallback(async () => {
    if (!formData) {
      setStatusMessage({ error: 'Form data is missing.' });
      return { success: false };
    }

    try {
      const response = isEditMode ? await updateTask(formData) : await addTask(formData);
      console.log(response);

      setStatusMessage({
        success: isEditMode ? 'Task updated successfully!' : 'Task created successfully!',
      });

      setOpenConfirm(false);
      onClose();
      await getTasks();
      onSuccess && (await onSuccess());

      return { success: true };
    } catch (error) {
      setStatusMessage({ error: 'Something went wrong. Please try again.' });
      return { success: false };
    }
  }, [formData, isEditMode, onClose, onSuccess]);

  const formFields = [
    { name: 'task_name', label: 'Task Name' },
    { name: 'description', label: 'Description', props: { multiline: true, rows: 3 } },
    { name: 'expected_start_date', label: 'Expected Start Date', props: { type: 'date', inputProps: { min: today }, defaultValue: today } },
    { name: 'expected_working_hours', label: 'Expected Hours', props: { type: 'number' } },
    { name: 'hourly_rate', label: 'Hourly Rate', props: { type: 'text' } },
    { name: 'rate_currency', label: 'Currency' },
    { name: 'category', label: 'Category' },
  ];

  return (
    <>
      {/* Submit Modal should be rendered above everything else */}
      <SubmitModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onSubmit={handleFinalSubmit}
        title={isEditMode ? 'Update Task' : 'Create Task'}
        description="Are you sure you want to proceed?"
        successMessage={statusMessage.success || ''}
        errorMessage={statusMessage.error || ''}
        onSuccess={onSuccess}
      />

      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TaskIcon />
            </Avatar>
            <Typography variant="h6">
              {isEditMode ? 'Update Task' : 'Create Task'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                {formFields.map((field, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <FormInput
                      name={field.name as keyof Task}
                      label={field.label}
                      fullWidth
                      {...field.props}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </FormProvider>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(submitHandler)}
            variant="contained"
            color="primary"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
          >
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
