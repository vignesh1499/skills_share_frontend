// SkillForm.tsx
'use client';

import {
  useForm,
  FormProvider,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Avatar, useMediaQuery, useTheme, MenuItem,
} from '@mui/material';
import { Grid } from "@material-ui/core";
import { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';

import SubmitModal from '../components/SubmitModal';
import { providerSkillSchema } from '../schemas/skill.schema';
import { ProviderSkill } from '../types/skill.types';
import { defaultValues } from '../constants/skillValues';
import { addSkill, updateSkill } from '../services/skill.service';
import FormInput from './FormInput';

interface SkillFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<ProviderSkill>;
  isEditMode?: boolean;
  onSuccessReload?: () => Promise<void>;
  onSubmit: (data: ProviderSkill) => Promise<void>;
}

export default function SkillForm({
  open, onClose, initialValues = {}, isEditMode = false, onSubmit, onSuccessReload
}: SkillFormProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formData, setFormData] = useState<ProviderSkill | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const methods = useForm<ProviderSkill>({
    resolver: yupResolver(providerSkillSchema),
    mode: 'onChange',
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const {
    handleSubmit, trigger, reset, formState: { isValid, isSubmitting },
  } = methods;

  useEffect(() => {
    reset({ ...defaultValues, ...initialValues });
  }, [initialValues, reset]);

  const submitHandler: SubmitHandler<ProviderSkill> = async (data) => {
    const valid = await trigger();
    if (!valid) return;
    setFormData(data);
    setOpenConfirm(true);
  };

  const handleFinalSubmit = async (): Promise<{ success: boolean }> => {
    if (!formData) {
      setErrorMessage("Form data is missing.");
      return { success: false };
    }

    try {
      await onSubmit(formData);
      const resposne = isEditMode ? await updateSkill(formData) : await addSkill(formData);
      console.log("Form API response", resposne);
      setSuccessMessage(isEditMode ? 'Skill updated successfully!' : 'Skill registered successfully!');
      setErrorMessage('');
      setOpenConfirm(false);
      onClose();
      if (onSuccessReload) {
        onSuccessReload();
      }
      return { success: true };
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
      setSuccessMessage('');
      return { success: false };
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="md" fullWidth disableEnforceFocus
        disableAutoFocus>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="h6">
              {isEditMode ? 'Update Skill' : 'Register Provider Skill'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormInput name="category" label="Category" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="experience" label="Experience (years)" type="number" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="nature_of_work" label="Nature of Work" defaultValue={initialValues?.nature_of_work || 'onsite'} select fullWidth>
                    <MenuItem value="onsite">Onsite</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                  </FormInput>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="hourly_rate" label="Hourly Rate" type="text" />
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit(submitHandler)} variant="contained" color="primary" disabled={!isValid || isSubmitting}>
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <SubmitModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onSubmit={handleFinalSubmit}
        title={isEditMode ? 'Update Skill' : 'Register Provider Skill'}
        description="Are you sure you want to proceed?"
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </>
  );
}
