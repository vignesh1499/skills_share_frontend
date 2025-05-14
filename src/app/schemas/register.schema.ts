import * as Yup from 'yup';

export const step1Schema = Yup.object({
  role: Yup.string().required('Role is required'),
  type: Yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Provider type is required'),
  }),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  company_name: Yup.string().when(['role', 'type'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) => schema.required('Company name is required'),
  }),
  business_tax_number: Yup.string().when(['role', 'type'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) => schema.required('Tax number is required').matches(/^\d{9}$/, 'Must be 9 digits'),
  }),
  represntative_full_name: Yup.string().when(['role', 'type'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) => schema.required('Representative name is required'),
  }),
  phone_number: Yup.string().when(['role', 'type'], {
    is: (role: string, type: string) => role === 'provider' && type === 'company',
    then: (schema) => schema.required('Phone is required').matches(/^\+?\d{10,15}$/, 'Invalid phone number'),
  }),
  mobile: Yup.string()
    .required('Mobile is required')
    .matches(/^\d+$/, 'Mobile must be numeric')
    .test('len', 'Mobile should be 10 digits', (val) => val?.length >= 10),
});

export const step2Schema = Yup.object({
  address_street: Yup.string().required('Street is required'),
  address_city: Yup.string().required('City is required'),
  address_state: Yup.string().required('State is required'),
  address_post_code: Yup.string().required('Post code is required').matches(/^\d{6}$/, 'Must be 6 digits'),
});

export const step3Schema = Yup.object({
  password: Yup.string().required('Password is required').min(6, 'Min 6 characters'),
  confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

export  const registerSchemas = [step1Schema, step2Schema, step3Schema];
