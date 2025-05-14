'use client';

import {
  useForm,
  FormProvider,
  useFormContext,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  FormControl,
  MenuItem,
  Container,
  CssBaseline,
  Avatar,
  Typography,
  Paper,
} from '@mui/material';
import { Grid } from '@material-ui/core';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SubmitModal from '../components/SubmitModal';
import { register } from '../services/auth.service';
import { RegistrationFormValues } from '../types/form.types';
import { defaultValues } from '../constants/registerValues';
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from '../schemas/register.schema';

const steps = ['Role & Provider Info', 'Address Info', 'Password Setup'];
const validationSchemas = [step1Schema, step2Schema, step3Schema];

const FormInput = ({
  name,
  label,
  type = 'text',
  select = false,
  children,
}: {
  name: keyof RegistrationFormValues;
  label: string;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const error = errors[name];
  const helperText =
    typeof error?.message === 'string' ? error.message : undefined;

  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register(name)}
          label={label}
          type={type}
          select={select}
          size="small"
          error={!!error}
          helperText={helperText}
        >
          {select ? children : null}
        </TextField>
      </FormControl>
    </Grid>
  );
};

export default function RegistrationForm() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormValues>(defaultValues);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const methods = useForm<RegistrationFormValues>({
    resolver: yupResolver(validationSchemas[step] as any),
    mode: 'onChange',
    defaultValues,
    shouldUnregister: false,
  });

  const {
    watch,
    handleSubmit,
    trigger,
    formState: { isValid, isSubmitting },
  } = methods;

  const role = watch('role');
  const providerType = watch('type');
  const isProviderCompany = role === 'provider' && providerType === 'company';

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    const valid = await trigger();
    if (!valid) return;

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setFormData(data);
      setOpenSubmitModal(true);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);
  const handleCloseSubmitModal = () => setOpenSubmitModal(false);

  const handleFinalSubmit = async (): Promise<{ success: boolean }> => {
    try {
      const response: any = await register(formData);
      setSuccessMessage('Registration successful');
      router.push('/login');
      setFormData(defaultValues);
      return { success: true };
    } catch (error: any) {
      setFormData(defaultValues);
      setErrorMessage(error.response?.data || 'An error occurred');
      return { success: false };
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper elevation={6} sx={{ padding: 4, mt: 8, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
        </Box>

        <FormProvider {...methods}>
          <Box maxWidth={600} mx="auto" mt={4}>
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box mt={4} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {step === 0 && (
                <Grid container spacing={2}>
                  <FormInput name="role" label="Role" select>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="provider">Provider</MenuItem>
                  </FormInput>
                  <FormInput name="first_name" label="First Name" />
                  <FormInput name="last_name" label="Last Name" />
                  <FormInput name="email" label="Email" type="email" />
                  <FormInput name="mobile" label="Mobile" />
                  {role === 'provider' && (
                    <FormInput name="type" label="Provider Type" select>
                      <MenuItem value="individual">Individual</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                    </FormInput>
                  )}
                  {isProviderCompany && (
                    <>
                      <FormInput name="company_name" label="Company Name" />
                      <FormInput name="business_tax_number" label="Business Tax Number" />
                      <FormInput name="represntative_full_name" label="Representative Name" />
                      <FormInput name="phone_number" label="Representative Phone" />
                    </>
                  )}
                </Grid>
              )}

              {step === 1 && (
                <Grid container spacing={2}>
                  <FormInput name="address_street" label="Street" />
                  <FormInput name="address_city" label="City" />
                  <FormInput name="address_state" label="State" />
                  <FormInput name="address_post_code" label="Post Code" />
                </Grid>
              )}

              {step === 2 && (
                <Grid container spacing={2}>
                  <FormInput name="password" label="Password" type="password" />
                  <FormInput name="confirm_password" label="Confirm Password" type="password" />
                </Grid>
              )}

              <Box mt={2} display="flex" justifyContent="space-between">
                {step > 0 && (
                  <Button onClick={handleBack} variant="outlined">
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isValid || isSubmitting}
                >
                  {step === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </Box>
          </Box>
        </FormProvider>
      </Paper>

      {openSubmitModal && (
        <SubmitModal
          open={openSubmitModal}
          onClose={handleCloseSubmitModal}
          onSubmit={handleFinalSubmit}
          title="Register Provider"
          description="Are you sure you want to proceed?"
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      )}
    </Container>
  );
}
