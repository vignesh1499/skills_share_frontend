// schemas/providerSkillSchema.ts
import * as yup from 'yup';
import { ProviderSkill } from '../types/skill.types';

export const providerSkillSchema: yup.ObjectSchema<ProviderSkill> = yup.object({
  id: yup.string().optional(),
  providerId: yup.string().optional(),
  category: yup
    .string()
    .required('Category is required'),
  experience: yup
    .number()
    .typeError('Experience must be a number')
    .min(0, 'Experience must be at least 0')
    .required('Experience is required'),
  nature_of_work: yup
    .string()
    .oneOf(['onsite', 'online'], 'Nature of work must be onsite or online')
    .required('Nature of work is required'),
  hourly_rate: yup
    .number()
    .typeError('Hourly rate must be a number')
    .min(0, 'Hourly rate must be at least 0')
    .required('Hourly rate is required'),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
});
