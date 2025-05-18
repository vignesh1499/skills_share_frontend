'use client';

import {
  useForm,
  FormProvider,
  useFormContext,
  SubmitHandler,
  useWatch,
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
import { Grid } from "@material-ui/core"
import { useState, memo } from 'react';
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

// === Reusable Form Input ===
const FormInput = memo(function FormInput({
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
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const error = errors[name];
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
          helperText={typeof error?.message === 'string' ? error.message : ''}
        >
          {select ? children : null}
        </TextField>
      </FormControl>
    </Grid>
  );
});

// === Step Components ===
const Step1 = memo(() => {
  const { control } = useFormContext<RegistrationFormValues>();
  const role = useWatch({ control, name: 'role' });
  const providerType = useWatch({ control, name: 'type' });
  const isProviderCompany = role === 'provider' && providerType === 'company';

  return (
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
  );
});

const Step2 = memo(() => (
  <Grid container spacing={2}>
    <FormInput name="address_street" label="Street" />
    <FormInput name="address_city" label="City" />
    <FormInput name="address_state" label="State" />
    <FormInput name="address_post_code" label="Post Code" />
  </Grid>
));

const Step3 = memo(() => (
  <Grid container spacing={2}>
    <FormInput name="password" label="Password" type="password" />
    <FormInput name="confirm_password" label="Confirm Password" type="password" />
  </Grid>
));

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormValues>(defaultValues);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const methods = useForm<RegistrationFormValues>({
    resolver: yupResolver(validationSchemas[step] as any),
    defaultValues,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    const isStepValid = await trigger();
    if (!isStepValid) return;

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setFormData(data);
      setOpenSubmitModal(true);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);
  const handleFinalSubmit = async (): Promise<{ success: boolean }> => {
    try {
      await register(formData);
      setSuccessMessage('Registration successful!');
      router.push('/login');
      return { success: true };
    } catch (error: any) {
      setErrorMessage(error?.response?.data || 'Registration failed');
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
              {step === 0 && <Step1 />}
              {step === 1 && <Step2 />}
              {step === 2 && <Step3 />}

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
          onClose={() => setOpenSubmitModal(false)}
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
