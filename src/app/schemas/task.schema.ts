import * as yup from 'yup';
import { TaskValues } from '../types/task.types';

export const taskSchema: yup.ObjectSchema<TaskValues> = yup.object({
  id: yup.string().optional(),
  task_name: yup.string().required('Task name is required'),
  description: yup.string().required('Description is required'),
  expected_start_date: yup
    .string()
    .required('Expected start date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  expected_working_hours: yup
    .number()
    .typeError('Expected working hours must be a number')
    .min(1, 'Must be at least 1 hour')
    .required('Expected working hours is required'),
  hourly_rate: yup
    .string()
    .typeError('Hourly rate must be a number')
    .min(0, 'Hourly rate must be non-negative')
    .required('Hourly rate is required'),
  userId: yup.string().optional(),
  category: yup.string().required('Category is required'),
  rate_currency: yup
    .string()
    .required('Currency is required')
    .length(3, 'Currency must be a 3-letter code (e.g., USD)'),
  task_completed: yup.boolean().optional(),
});
