import * as yup from 'yup';
import { Skill } from '../types/skill.types';

export const skillFormSchema:yup.ObjectSchema<Skill> = yup.object({
  id: yup.number().optional(),
  providerId: yup.string().optional(),
  userId: yup.string().optional(),
  category: yup.string().required('Category is required'),
  experience: yup
    .number()
    .typeError('Experience must be a number')
    .min(0, 'Experience cannot be negative')
    .required('Experience is required'),
  nature_of_work: yup
    .mixed<'onsite' | 'online'>()
    .oneOf(['onsite', 'online'], 'Nature of work must be onsite or online')
    .required('Nature of work is required'),
  hourly_rate: yup
    .number()
    .typeError('Hourly rate must be a number')
    .positive('Hourly rate must be greater than 0')
    .required('Hourly rate is required'),
  status: yup
    .mixed<'open' | 'accepted' | 'completed' | 'rejected'>()
    .oneOf(['open', 'accepted', 'completed', 'rejected']).nullable()
    .optional(),
  completion: yup.boolean().optional(),
  approval: yup.boolean().optional(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
});

