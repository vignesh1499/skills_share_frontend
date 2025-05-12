'use client';
import {
  useForm,
  FormProvider,
  useFormContext,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
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
import { use, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SubmitModal from '../components/submitModal';

// Steps
const steps = ['Role & Provider Info', 'Address Info', 'Password Setup'];

// Types
type FormValues = {
  role: string;
  providerType?: string;
  companyName?: string;
  businessTaxNumber?: string;
  representativeName?: string;
  representativePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Step 1 Schema
const step1Schema = Yup.object({
  role: Yup.string().required('Role is required'),
  providerType: Yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Provider type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  companyName: Yup.string().when(['role', 'providerType'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) => schema.required('Company name is required'),
  }),
  businessTaxNumber: Yup.string().when(['role', 'providerType'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) =>
      schema
        .required('Tax number is required')
        .matches(/^\d{9}$/, 'Must be 9 digits'),
  }),
  representativeName: Yup.string().when(['role', 'providerType'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) => schema.required('Representative name is required'),
  }),
  representativePhone: Yup.string().when(['role', 'providerType'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) =>
      schema
        .required('Phone is required')
        .matches(/^\+?\d{10,15}$/, 'Invalid phone number'),
  }),
});

// Step 2 Schema
const step2Schema = Yup.object({
  addressLine1: Yup.string().required('Address Line 1 is required'),
  addressLine2: Yup.string().optional(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zipCode: Yup.string().required('Zip code is required'),
});

// Step 3 Schema
const step3Schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const validationSchemas = [step1Schema, step2Schema, step3Schema];

// Default values
const defaultValues: FormValues = {
  role: '',
  providerType: '',
  companyName: '',
  businessTaxNumber: '',
  representativeName: '',
  representativePhone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  email: '',
  password: '',
  confirmPassword: '',
};

// Form input wrapper
const FormInput = ({
  name,
  label,
  type = 'text',
  select = false,
  children,
  ...rest
}: {
  name: keyof FormValues;
  label: string;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const error = errors[name];
  const helperText = typeof error?.message === 'string' ? error.message : undefined;

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
          {...rest}
        >
          {select ? children : null}
        </TextField>
      </FormControl>
    </Grid>
  );
};

// Main component
export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);

  //handle submit
  const handleOpenSubmitModal = () => {
    setOpenSubmitModal(true);
  };

  ///handle close submit modal
  const handleCloseSubmitModal = () => {
    setOpenSubmitModal(false);
  };

  //Final Submit
  const handleFinalSubmit = (data: FormValues) => {
    console.log('Final Submit:', data);
    handleCloseSubmitModal()
  };



  const methods = useForm<FormValues>({
    resolver: yupResolver(validationSchemas[step] as any),
    mode: 'onTouched',
    defaultValues,
    shouldUnregister: false,
  });

  const { watch, handleSubmit, trigger } = methods;

  const role = watch('role');
  const providerType = watch('providerType');
  const isProviderCompany = role === 'provider' && providerType === 'company';

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (step < steps.length - 1) {
      const valid = await trigger();
      if (valid) {
        setStep((prev) => prev + 1);
      }
    } else {
      console.log('Final Submit:', data);
      // You can send the data to API here
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

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
                <>
                  <Grid container spacing={2}>
                    <FormInput name="role" label="Role" select>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="provider">Provider</MenuItem>
                    </FormInput>
                    <FormInput name="email" label="Email" type="email" />

                    {role === 'provider' && (
                      <FormInput name="providerType" label="Provider Type" select>
                        <MenuItem value="individual">Individual</MenuItem>
                        <MenuItem value="company">Company</MenuItem>
                      </FormInput>
                    )}

                    {isProviderCompany && (
                      <>
                        <FormInput name="companyName" label="Company Name" />
                        <FormInput name="businessTaxNumber" label="Business Tax Number" />
                        <FormInput name="representativeName" label="Representative Name" />
                        <FormInput name="representativePhone" label="Representative Phone" />
                      </>
                    )}
                  </Grid>
                </>
              )}

              {step === 1 && (
                <>
                  <Grid container spacing={2}>
                    <FormInput name="addressLine1" label="Address Line 1" />
                    <FormInput name="addressLine2" label="Address Line 2" />
                    <FormInput name="city" label="City" />
                    <FormInput name="state" label="State" />
                    <FormInput name="country" label="Country" />
                    <FormInput name="zipCode" label="Zip Code" />
                  </Grid>
                </>
              )}

              {step === 2 && (
                <>
                  <Grid container spacing={2}>
                    <FormInput name="password" label="Password" type="password" />
                    <FormInput name="confirmPassword" label="Confirm Password" type="password" />
                  </Grid>
                </>
              )}

              <Box mt={2} display="flex" justifyContent="space-between">
                {step > 0 && (
                  <Button onClick={handleBack} variant="outlined">
                    Back
                  </Button>
                )}
                <Button type="submit" variant="contained" color="primary" onClick={() => {
                  if (step === steps.length - 1) {
                    handleOpenSubmitModal();
                  }
                  // Add your existing submit or next step logic here
                }}>
                  {step === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </Box>
          </Box>
        </FormProvider>
      </Paper>
      <SubmitModal open={openSubmitModal} onClose={handleCloseSubmitModal} onSubmit={() => handleFinalSubmit} actionLabel='Submit' cancelLabel='Cancel' title={''} description={''} />
    </Container>
  );
}
