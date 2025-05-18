'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Grid } from '@material-ui/core';
import BuildIcon from '@mui/icons-material/Build';
import SubmitModal from './SubmitModal';
import FormInput from './FormInput';
import { skillFormSchema } from '../schemas/skill.schema';
import { Skill } from '../types/skill.types';
import { addSkill, updateSkill } from '../services/skill.service';
import { defaultValues } from '../constants/skillValues';
import { number } from 'yup';

interface SkillFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<Skill>;
  isEditMode?: boolean;
   onSubmit?: (data: Skill) => Promise<void>;
  onSuccess?: () => Promise<void>;
}

export default function SkillForm({
  open,
  onClose,
  initialValues,
  isEditMode = false,
  onSubmit,
  onSuccess,
}: SkillFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const mergedDefaultValues = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues]
  );

  const methods = useForm<Skill>({
    resolver: yupResolver(skillFormSchema),
    mode: 'onChange',
    defaultValues: mergedDefaultValues,
  });

  const {
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { isValid, isSubmitting },
  } = methods;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success?: string; error?: string }>({});

  useEffect(() => {
    reset(mergedDefaultValues);
  }, [mergedDefaultValues, reset]);

  const submitHandler: SubmitHandler<Skill> = useCallback(
    async (data) => {
      const valid = await trigger();
      if (!valid) return;

      setOpenConfirm(true); // proceed to confirmation modal
    },
    [trigger]
  );

const handleFinalSubmit = useCallback(async () => {
  try {
    const rawData = getValues();

    const data = {
      ...rawData,
      experience: Number(rawData.experience),
      hourly_rate: Number(rawData.hourly_rate),
    };

    const response = isEditMode ? await updateSkill(data) : await addSkill(data);
    console.log('Success:', response);

    setStatusMessage({
      success: isEditMode ? 'Skill updated successfully!' : 'Skill created successfully!',
    });
    setOpenConfirm(false);
    onClose();
    if (onSuccess) await onSuccess();
    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    setStatusMessage({ error: 'Something went wrong. Please try again.' });
    return { success: false };
  }
}, [getValues, isEditMode, onClose, onSuccess]);

  return (
    <>
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
              <BuildIcon />
            </Avatar>
            <Typography variant="h6">
              {isEditMode ? 'Update Skill' : 'Create Skill'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormInput name="category" label="Category" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="experience" label="Experience (Years)" type="number" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="nature_of_work"
                    label="Nature of Work"
                    select
                    options={[
                      { label: 'Onsite', value: 'onsite' },
                      { label: 'Online', value: 'online' },
                    ]}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="hourly_rate" label="Hourly Rate" type="number" fullWidth />
                </Grid>
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

      {openConfirm && (
        <SubmitModal
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onSubmit={ handleFinalSubmit}
          title={isEditMode ? 'Update Skill' : 'Create Skill'}
          description="Are you sure you want to proceed?"
          successMessage={statusMessage?.success || ''}
          errorMessage={statusMessage?.error || ''}
        />
      )}
    </>
  );
}
